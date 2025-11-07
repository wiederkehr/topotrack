import { along as turfAlong, lineString as turfLineString } from "@turf/turf";
import type { Map as MapboxGLMap } from "mapbox-gl";

import { calculateBearing, dampBearing } from "../../utilities/bearing";
import { calculateLineDistance } from "../../utilities/distance";
import {
  createRAFAnimation,
  validateCoordinates,
  validateRoute,
} from "../helpers";
import type { FollowPathOptions } from "../types";

/**
 * Calculate bearing for dynamic bearing mode during followPath animation
 */
class BearingCalculator {
  private previousBearing: number | null = null;

  /**
   * Calculate bearing for current position on route
   */
  calculateBearing(
    map: MapboxGLMap,
    bearingOptions: FollowPathOptions["bearingOptions"],
    progress: number,
    routeDistance: number,
    currentCoords: [number, number],
    lineString: ReturnType<typeof turfLineString>,
    deltaTime: number,
  ): number {
    let currentBearing = map.getBearing();

    if (!bearingOptions) {
      return currentBearing;
    }

    const bearingType =
      "type" in bearingOptions ? bearingOptions.type : "fixed";

    if (bearingType === "fixed") {
      // Fixed bearing - no interpolation
      currentBearing = bearingOptions.bearing;
    } else if (bearingType === "rotation") {
      // 360-degree rotation over the course of the animation
      const startBearing = bearingOptions.bearing;
      const rotationBearing = startBearing + progress * 360;

      // Apply damping for smooth transitions if specified
      if ("damping" in bearingOptions && bearingOptions.damping !== undefined) {
        if (this.previousBearing === null) {
          currentBearing = rotationBearing;
        } else {
          currentBearing = dampBearing(
            this.previousBearing,
            rotationBearing,
            bearingOptions.damping,
            deltaTime,
          );
        }
        this.previousBearing = currentBearing;
      } else {
        currentBearing = rotationBearing;
        this.previousBearing = currentBearing;
      }
    } else if (bearingType === "dynamic") {
      // Dynamic bearing - look ahead along the route
      if ("lookAhead" in bearingOptions) {
        const distance = progress * routeDistance || 0;
        const lookAheadDistance = bearingOptions.lookAhead * routeDistance;
        const lookAheadPoint = turfAlong(
          lineString,
          Math.min(distance + lookAheadDistance, routeDistance),
        );

        if (
          lookAheadPoint &&
          lookAheadPoint.geometry &&
          lookAheadPoint.geometry.coordinates
        ) {
          const lookAheadCoords = lookAheadPoint.geometry.coordinates as [
            number,
            number,
          ];

          // Calculate target bearing from current to look-ahead point
          const targetBearing = calculateBearing(
            currentCoords,
            lookAheadCoords,
          );

          // Apply damping for smooth transitions
          if (this.previousBearing === null) {
            currentBearing = targetBearing;
          } else {
            const damping =
              "damping" in bearingOptions ? bearingOptions.damping : 0.9;
            currentBearing = dampBearing(
              this.previousBearing,
              targetBearing,
              damping,
              deltaTime,
            );
          }

          this.previousBearing = currentBearing;
        }
      }
    }

    return currentBearing;
  }
}

/**
 * Play followPath animation
 * Camera moves along route with optional dynamic bearing
 *
 * @param map - Mapbox GL map instance
 * @param options - FollowPath options (route, duration, bearingOptions, pitch)
 * @param signal - Optional AbortSignal for cancellation
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playFollowPath(map, {
 *   route: [[0, 0], [1, 1], [2, 2]],
 *   duration: 5000,
 *   bearingOptions: { type: 'dynamic', lookAhead: 0.15 },
 *   pitch: 45
 * });
 */
export async function playFollowPath(
  map: MapboxGLMap,
  options: FollowPathOptions,
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  // Validate route
  const validRoute = validateRoute(options.route, 2);
  if (validRoute.length < 2) {
    return Promise.reject(
      new Error("Route must contain at least 2 valid coordinates"),
    );
  }

  const lineString = turfLineString(validRoute);
  const routeDistance = calculateLineDistance(lineString);

  // Guard against zero-distance routes
  if (routeDistance === 0) {
    const startCoords = validRoute[0];
    if (startCoords) {
      map.easeTo({
        center: startCoords,
        duration: 0,
        bearing: options.bearingOptions?.bearing ?? map.getBearing(),
        pitch: options.pitch ?? map.getPitch(),
      });
    }
    return Promise.resolve();
  }

  const bearingCalculator = new BearingCalculator();
  let lastFrameTime: number | null = null;

  return createRAFAnimation(
    (currentTime, progress) => {
      // Check if abort was requested
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      // Calculate delta time for this frame
      const deltaTime =
        lastFrameTime !== null ? currentTime - lastFrameTime : 16.67;
      lastFrameTime = currentTime;

      // Calculate distance for this progress point
      const distance = routeDistance * progress;

      // Ensure distance is valid and within bounds
      if (!isFinite(distance) || distance < 0) {
        console.warn("Invalid distance calculated:", {
          distance,
          routeDistance,
          progress,
        });
        return;
      }

      // Calculate camera position along the route
      const positionPoint = turfAlong(lineString, distance);
      if (
        !positionPoint ||
        !positionPoint.geometry ||
        !positionPoint.geometry.coordinates
      ) {
        console.warn("Invalid positionPoint returned from turfAlong");
        return;
      }

      const coords = positionPoint.geometry.coordinates as [number, number];

      // Validate coords before using them
      if (!validateCoordinates(coords)) {
        console.warn("Invalid coordinates from turfAlong:", coords);
        return;
      }

      // Calculate bearing based on bearing mode
      const currentBearing = bearingCalculator.calculateBearing(
        map,
        options.bearingOptions,
        progress,
        routeDistance,
        coords,
        lineString,
        deltaTime,
      );

      // Move camera to position
      map.easeTo({
        center: coords,
        duration: 0,
        bearing: currentBearing,
        pitch: options.pitch ?? map.getPitch(),
      });
    },
    options.duration,
    signal,
  );
}
