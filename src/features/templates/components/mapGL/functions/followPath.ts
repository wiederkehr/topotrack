import { along, length } from "@turf/turf";
import { Map, MercatorCoordinate } from "mapbox-gl";

import { calculateBearing } from "./calculateBearing";
import { computeCameraPosition } from "./computeCameraPosition";
import type { PositionType } from "./types";

/**
 * Interpolates between two bearing values, accounting for 360° wrap-around.
 * For example, interpolating between 350° and 10° should go through 0°, not 180°.
 *
 * @param currentBearing - Current bearing in degrees (0-360)
 * @param targetBearing - Target bearing in degrees (0-360)
 * @param damping - Damping factor (0 = instant, 1 = no change)
 * @returns Smoothed bearing in degrees (0-360)
 */
function dampBearing(
  currentBearing: number,
  targetBearing: number,
  damping: number,
): number {
  // Calculate the shortest angular difference
  let diff = targetBearing - currentBearing;

  // Normalize to -180 to 180 range
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  // Apply damping (lerp from current to target)
  const smoothedBearing = currentBearing + diff * (1 - damping);

  // Normalize to 0-360 range
  return (smoothedBearing + 360) % 360;
}

type FollowPathProps = {
  /** Constant altitude in meters to maintain while following the path */
  altitude: number;
  /** Damping factor for bearing smoothing (0 = instant, 1 = very smooth). Default: 0.9 */
  bearingDamping?: number;
  /** Animation duration in milliseconds */
  duration: number;
  /** Optional: Look-ahead distance in kilometers to calculate bearing. Default: 0.05km (50m) */
  lookAheadDistance?: number;
  /** Mapbox GL map instance */
  map: Map;
  /** Callback fired on each frame with the current position along the path */
  onUpdate?: (position: PositionType) => void;
  /** GeoJSON LineString representing the path to follow */
  path: GeoJSON.Feature<GeoJSON.LineString>;
  /** Constant pitch in degrees (0 = looking straight down) to maintain */
  pitch: number;
};

/**
 * Animates the camera following along a path at constant altitude and pitch.
 * The bearing automatically adjusts to follow the path direction with smooth damping.
 * Uses Mapbox's FreeCameraOptions API for proper 3D camera positioning, which fixes
 * the offset issue when pitch > 0.
 *
 * @param props - Animation parameters
 * @returns Promise that resolves when animation completes
 *
 * @example
 * ```ts
 * await followPath({
 *   map: mapRef.current.getMap(),
 *   path: lineString(coordinates),
 *   duration: 3000,
 *   altitude: 5000,
 *   pitch: 60,
 *   lookAheadDistance: 0.1, // Look 100m ahead
 *   bearingDamping: 0.85, // Smooth bearing transitions
 *   onUpdate: (pos) => setCurrentPosition([pos.lng, pos.lat]),
 * });
 * ```
 */
function followPath({
  map,
  duration,
  path,
  altitude,
  pitch,
  onUpdate,
  lookAheadDistance = 0.05, // Default 50m look-ahead
  bearingDamping = 0.9, // Default smooth damping
}: FollowPathProps): Promise<void> {
  return new Promise((resolve) => {
    let startTime: number | undefined;
    let currentBearing: number | undefined; // Track smoothed bearing

    // Calculate the total distance of the path in kilometers
    const totalDistance = length(path);

    function frame(currentTime: number) {
      // Set start time
      if (!startTime) startTime = currentTime;

      // Calculate progress (0 to 1)
      const progress = (currentTime - startTime) / duration;
      const easedProgress = Math.min(progress, 1);

      // Get the current point along the path
      const currentDistance = totalDistance * easedProgress;
      const currentPoint = along(path, currentDistance);
      const targetPosition: PositionType = {
        lat: currentPoint.geometry.coordinates[1] as number,
        lng: currentPoint.geometry.coordinates[0] as number,
      };

      // Calculate bearing by looking ahead along the path
      const lookAheadPoint = along(
        path,
        Math.min(currentDistance + lookAheadDistance, totalDistance),
      );
      const nextPosition: PositionType = {
        lat: lookAheadPoint.geometry.coordinates[1] as number,
        lng: lookAheadPoint.geometry.coordinates[0] as number,
      };

      // Calculate target bearing based on path direction
      const targetBearing = calculateBearing(targetPosition, nextPosition);

      // Initialize currentBearing on first frame
      if (currentBearing === undefined) {
        currentBearing = targetBearing;
      }

      // Apply damping to smooth bearing changes
      currentBearing = dampBearing(
        currentBearing,
        targetBearing,
        bearingDamping,
      );

      // Compute camera ground position to keep target in view with smoothed bearing
      const cameraGroundPosition = computeCameraPosition({
        targetPosition,
        altitude,
        bearing: currentBearing,
        pitch,
      });

      // Use FreeCameraOptions API for proper 3D positioning
      const camera = map.getFreeCameraOptions();

      // Convert geographic coordinates + altitude to mercator coordinate
      camera.position = MercatorCoordinate.fromLngLat(
        [cameraGroundPosition.lng, cameraGroundPosition.lat],
        altitude,
      );

      // Set pitch and smoothed bearing
      camera.setPitchBearing(pitch, currentBearing);

      // Apply camera changes
      map.setFreeCameraOptions(camera);

      // Call onUpdate callback with the actual position along the path
      if (onUpdate) {
        onUpdate(targetPosition);
      }

      // Continue animation or resolve promise
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

export { followPath };
