import { along, length } from "@turf/turf";

import { calculateBearing } from "./calculateBearing";
import type { PositionType } from "./types";

type GetInitialBearingProps = {
  /** Optional: Look-ahead distance in kilometers to calculate bearing. Default: 0.05km (50m) */
  lookAheadDistance?: number;
  /** GeoJSON LineString representing the path to follow */
  path: GeoJSON.Feature<GeoJSON.LineString>;
};

/**
 * Calculates the initial bearing for following a path.
 * This is useful for aligning the end state of a flyTo animation with the start
 * of a followPath animation for smooth transitions.
 *
 * @param props - Parameters for calculating initial bearing
 * @returns The initial bearing in degrees (0-360)
 *
 * @example
 * ```ts
 * const initialBearing = getInitialBearing({
 *   path: lineString(coordinates),
 *   lookAheadDistance: 0.5, // Look 500m ahead
 * });
 *
 * // Use this bearing as the stopBearing for flyToPoint
 * await flyToPoint({
 *   // ... other props
 *   stopBearing: initialBearing,
 * });
 * ```
 */
export function getInitialBearing({
  path,
  lookAheadDistance = 0.05, // Default 50m look-ahead (same as followPath default)
}: GetInitialBearingProps): number {
  // Get the starting point of the path
  const startPoint = along(path, 0);
  const startPosition: PositionType = {
    lat: startPoint.geometry.coordinates[1] as number,
    lng: startPoint.geometry.coordinates[0] as number,
  };

  // Calculate the total distance of the path
  const totalDistance = length(path);

  // Get a point ahead on the path for bearing calculation
  const lookAheadPoint = along(
    path,
    Math.min(lookAheadDistance, totalDistance),
  );
  const lookAheadPosition: PositionType = {
    lat: lookAheadPoint.geometry.coordinates[1] as number,
    lng: lookAheadPoint.geometry.coordinates[0] as number,
  };

  // Calculate and return the bearing from start to look-ahead point
  return calculateBearing(startPosition, lookAheadPosition);
}
