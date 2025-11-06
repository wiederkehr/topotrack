import {
  along as turfAlong,
  lineString as turfLineString,
  point as turfPoint,
} from "@turf/turf";
import type { Map as MapboxGLMap } from "mapbox-gl";

import { calculateBearing, dampBearing } from "../utilities/bearing";
import { calculateLineDistance } from "../utilities/distance";
import { normalizedRoutePoints } from "./routeCalculations";
import type {
  AnimatePathOptions,
  AnimatePointOptions,
  AnimateRouteOptions,
  AnimationPhase,
  AnimationSequence,
  FitBoundsOptions,
  FollowPathOptions,
  RotateAroundPointOptions,
} from "./types";

/**
 * Play an animation sequence or single phase on a Mapbox GL map
 * Can accept either an AnimationSequence (multiple phases) or a single AnimationPhase
 *
 * @example
 * // Play a single phase directly
 * await playAnimation(map, mapAnimations.flyTo({ center: [0, 0], zoom: 10 }));
 *
 * @example
 * // Play a sequence of phases
 * await playAnimation(map, mapAnimations.sequence(
 *   mapAnimations.wait(500),
 *   mapAnimations.flyTo({ center: [0, 0], zoom: 10 })
 * ));
 */
export async function playAnimation(
  map: MapboxGLMap,
  animation: AnimationSequence | AnimationPhase,
): Promise<void> {
  // If it's a sequence, execute all phases
  if ("phases" in animation && Array.isArray(animation.phases)) {
    const sequence = animation as AnimationSequence;
    for (const phase of sequence.phases) {
      await playPhase(map, phase);
    }
  } else {
    // If it's a single phase, execute it directly
    await playPhase(map, animation as AnimationPhase);
  }
}

/**
 * Play a single animation phase
 * Returns a promise that resolves when the phase completes
 */
async function playPhase(
  map: MapboxGLMap,
  phase: AnimationPhase,
): Promise<void> {
  if (phase.type === "flyTo") {
    return playFlyTo(map, phase.options);
  }
  if (phase.type === "easeTo") {
    return playEaseTo(map, phase.options);
  }
  if (phase.type === "fitBounds") {
    return playFitBounds(map, phase.options);
  }
  if (phase.type === "followPath") {
    return playFollowPath(map, phase.options);
  }
  if (phase.type === "animatePoint") {
    return playAnimatePoint(map, phase.options);
  }
  if (phase.type === "animatePath") {
    return playAnimatePath(map, phase.options);
  }
  if (phase.type === "animateRoute") {
    return playAnimateRoute(map, phase.options);
  }
  if (phase.type === "wait") {
    return playWait(phase.duration);
  }
  if (phase.type === "custom") {
    return phase.fn(map);
  }
  if (phase.type === "rotateAroundPoint") {
    return playRotateAroundPoint(map, phase.options);
  }
  if (phase.type === "sync") {
    return playSync(map, phase.phases);
  }

  // Exhaustive check
  const _exhaustive: never = phase;
  return _exhaustive;
}

/**
 * Play flyTo animation using native Mapbox GL method
 */
async function playFlyTo(
  map: MapboxGLMap,
  options: Parameters<MapboxGLMap["flyTo"]>[0],
): Promise<void> {
  return new Promise((resolve) => {
    const duration = options.duration ?? 2000; // Default Mapbox duration
    const timeoutId = setTimeout(resolve, duration + 100); // Slight buffer

    const optionsWithCallback = {
      ...options,
      complete: () => {
        clearTimeout(timeoutId);
        resolve();
      },
    } as Parameters<MapboxGLMap["flyTo"]>[0] & { complete: () => void };
    map.flyTo(optionsWithCallback);
  });
}

/**
 * Play easeTo animation using native Mapbox GL method
 */
async function playEaseTo(
  map: MapboxGLMap,
  options: Parameters<MapboxGLMap["easeTo"]>[0],
): Promise<void> {
  return new Promise((resolve) => {
    const duration = options.duration ?? 500; // Default Mapbox duration
    const timeoutId = setTimeout(resolve, duration + 100); // Slight buffer

    const optionsWithCallback = {
      ...options,
      complete: () => {
        clearTimeout(timeoutId);
        resolve();
      },
    } as Parameters<MapboxGLMap["easeTo"]>[0] & { complete: () => void };
    map.easeTo(optionsWithCallback);
  });
}

/**
 * Play fitBounds animation using native Mapbox GL method
 */
async function playFitBounds(
  map: MapboxGLMap,
  fitBoundsOptions: FitBoundsOptions,
): Promise<void> {
  return new Promise((resolve) => {
    const {
      bounds,
      duration: customDuration,
      ...restOptions
    } = fitBoundsOptions;
    const duration = customDuration ?? 1000; // Default Mapbox duration
    const timeoutId = setTimeout(resolve, duration + 100); // Slight buffer

    const optionsWithCallback = {
      ...restOptions,
      duration: customDuration,
      complete: () => {
        clearTimeout(timeoutId);
        resolve();
      },
    } as Parameters<MapboxGLMap["fitBounds"]>[1] & { complete: () => void };
    map.fitBounds(bounds, optionsWithCallback);
  });
}

/**
 * Play followPath animation
 * Camera moves along route using Turf.js distance calculation
 */
async function playFollowPath(
  map: MapboxGLMap,
  options: FollowPathOptions,
): Promise<void> {
  // Validate route has at least 2 points
  if (!options.route || options.route.length < 2) {
    return Promise.reject(
      new Error("Route must contain at least 2 coordinates"),
    );
  }

  // Filter out any invalid coordinates (ensure each is a valid [number, number] tuple)
  const validRoute = options.route.filter(
    (coord) =>
      Array.isArray(coord) &&
      coord.length === 2 &&
      typeof coord[0] === "number" &&
      typeof coord[1] === "number" &&
      isFinite(coord[0]) &&
      isFinite(coord[1]),
  );

  if (validRoute.length < 2) {
    return Promise.reject(
      new Error("Route must contain at least 2 valid coordinates"),
    );
  }

  const lineString = turfLineString(validRoute);
  const routeDistance = calculateLineDistance(lineString);

  // Guard against zero-distance routes
  if (routeDistance === 0) {
    // If route has no distance, just set camera to start position
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

  return new Promise((resolve) => {
    let startTime: number | null = null;
    let previousBearing: number | null = null;
    let lastFrameTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      // Calculate delta time for this frame
      const deltaTime =
        lastFrameTime !== null ? currentTime - lastFrameTime : 16.67;
      lastFrameTime = currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / options.duration, 1);

      try {
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
        if (
          !Array.isArray(coords) ||
          coords.length !== 2 ||
          !isFinite(coords[0]) ||
          !isFinite(coords[1])
        ) {
          console.warn("Invalid coordinates from turfAlong:", coords);
          return;
        }

        // Calculate bearing based on bearing mode
        let currentBearing = map.getBearing();

        if (options.bearingOptions) {
          const bearingOpts = options.bearingOptions;
          const bearingType =
            "type" in bearingOpts ? bearingOpts.type : "fixed";

          if (bearingType === "fixed") {
            // Fixed bearing - no interpolation
            currentBearing = bearingOpts.bearing;
          } else if (bearingType === "rotation") {
            // 360-degree rotation over the course of the animation
            const startBearing = bearingOpts.bearing;
            const rotationBearing = startBearing + progress * 360;

            // Apply damping for smooth transitions if specified
            if ("damping" in bearingOpts && bearingOpts.damping !== undefined) {
              if (previousBearing === null) {
                currentBearing = rotationBearing;
              } else {
                currentBearing = dampBearing(
                  previousBearing,
                  rotationBearing,
                  bearingOpts.damping,
                  deltaTime,
                );
              }
              previousBearing = currentBearing;
            } else {
              currentBearing = rotationBearing;
              previousBearing = currentBearing;
            }
          } else if (bearingType === "dynamic") {
            // Dynamic bearing - look ahead along the route
            if ("lookAhead" in bearingOpts) {
              const lookAheadDistance = bearingOpts.lookAhead * routeDistance;
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
                const targetBearing = calculateBearing(coords, lookAheadCoords);

                // Apply damping for smooth transitions
                if (previousBearing === null) {
                  currentBearing = targetBearing;
                } else {
                  const damping =
                    "damping" in bearingOpts ? bearingOpts.damping : 0.9;
                  currentBearing = dampBearing(
                    previousBearing,
                    targetBearing,
                    damping,
                    deltaTime,
                  );
                }

                previousBearing = currentBearing;
              }
            }
          }
        }

        // Move camera to position
        map.easeTo({
          center: coords,
          duration: 0,
          bearing: currentBearing,
          pitch: options.pitch ?? map.getPitch(),
        });
      } catch (error) {
        console.error("Error during followPath animation:", {
          error,
          progress,
          routeDistance,
          validRouteLength: validRoute.length,
        });
        // Gracefully handle error by stopping animation
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Play animatePoint animation
 * Animates a point source along a route using live-update approach
 */
async function playAnimatePoint(
  map: MapboxGLMap,
  options: AnimatePointOptions,
): Promise<void> {
  const { route, duration, pointSourceId } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;
  const pointGeoJSON = turfPoint([0, 0]);

  return new Promise((resolve) => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPosition = Math.floor(
        progress * (normalizedRouteLength - 1),
      );
      const point = normalizedRoute[currentPosition];
      if (point) {
        pointGeoJSON.geometry.coordinates = point;
        const source = map.getSource(pointSourceId);
        if (source && "setData" in source) {
          source.setData(pointGeoJSON);
        }
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(animate);
  });
}

/**
 * Play animatePath animation
 * Animates a path source along a route using live-update approach
 */
async function playAnimatePath(
  map: MapboxGLMap,
  options: AnimatePathOptions,
): Promise<void> {
  const { route, duration, lineSourceId } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;
  const pathCoordinates: Array<[number, number]> = normalizedRoute.slice(0, 2);
  const pathGeoJSON = turfLineString(pathCoordinates);

  return new Promise((resolve) => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPosition = Math.floor(
        progress * (normalizedRouteLength - 1),
      );

      // Add coordinates incrementally - only push new ones, don't rebuild array
      while (pathCoordinates.length <= currentPosition) {
        const point = normalizedRoute[pathCoordinates.length];
        if (point) {
          pathCoordinates.push(point);
        } else {
          break;
        }
      }

      const source = map.getSource(lineSourceId);
      if (source && "setData" in source) {
        source.setData(pathGeoJSON);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Play animateRoute animation
 * Synchronously animates both a path and a point along a route
 * Both update in the same RAF frame, ensuring perfect synchronization
 */
async function playAnimateRoute(
  map: MapboxGLMap,
  options: AnimateRouteOptions,
): Promise<void> {
  const {
    route,
    duration,
    lineSourceId: lineId,
    pointSourceId: pointId,
  } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;

  // Initialize path coordinates and GeoJSON
  const pathCoordinates: Array<[number, number]> = normalizedRoute.slice(0, 2);
  const pathGeoJSON = turfLineString(pathCoordinates);

  // Initialize point GeoJSON
  const pointGeoJSON = turfPoint([0, 0]);

  return new Promise((resolve) => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPosition = Math.floor(
        progress * (normalizedRouteLength - 1),
      );

      // Update path coordinates incrementally
      while (pathCoordinates.length <= currentPosition) {
        const point = normalizedRoute[pathCoordinates.length];
        if (point) {
          pathCoordinates.push(point);
        } else {
          break;
        }
      }

      // Update point position
      const currentPoint = normalizedRoute[currentPosition];
      if (currentPoint) {
        pointGeoJSON.geometry.coordinates = currentPoint;
      }

      // Update both sources in the same frame
      const lineSource = map.getSource(lineId);
      if (lineSource && "setData" in lineSource) {
        lineSource.setData(pathGeoJSON);
      }

      const pointSource = map.getSource(pointId);
      if (pointSource && "setData" in pointSource) {
        pointSource.setData(pointGeoJSON);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Wait for specified duration
 */
async function playWait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

/**
 * Rotate the map around a point
 * Uses requestAnimationFrame for smooth continuous rotation
 */
async function playRotateAroundPoint(
  map: MapboxGLMap,
  options: RotateAroundPointOptions,
): Promise<void> {
  const startBearing = options.bearing ?? map.getBearing();

  return new Promise((resolve) => {
    let startTime: number | null = null;
    const timeoutId = setTimeout(resolve, options.duration + 100); // Fallback timeout

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / options.duration, 1);

      // Calculate current bearing based on progress
      const currentBearing = startBearing + options.degrees * progress;

      // Update map bearing
      map.rotateTo(currentBearing, { duration: 0 });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        clearTimeout(timeoutId);
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Play synchronized animations in parallel
 * All child animations execute concurrently with independent durations
 */
async function playSync(
  map: MapboxGLMap,
  phases: AnimationPhase[],
): Promise<void> {
  // Create promises for all child phases and execute them in parallel
  const promises: Promise<void>[] = [];

  for (const phase of phases) {
    promises.push(playPhase(map, phase));
  }

  // Wait for all animations to complete
  await Promise.all(promises);
}
