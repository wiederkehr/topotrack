import {
  along as turfAlong,
  length as turfLength,
  lineString as turfLineString,
} from "@turf/turf";

import { calculateBearing } from "./bearing";

/**
 * Calculate the bearing that followPath will use at its start position
 * This allows flyTo to end with the exact bearing that followPath will begin with,
 * creating a seamless transition between animations
 *
 * @param startCoord - Starting coordinate [lng, lat] on the route
 * @param route - Full route as array of [lng, lat] coordinates
 * @param lookAheadFraction - Look-ahead fraction (0-1, same as followPath bearingOptions.lookAhead)
 * @returns Bearing in degrees (0-360) that matches followPath's initial bearing
 *
 * @example
 * const bearing = calculateFollowBearing(startPosition, fullRoute, 0.15);
 * // Use in flyTo to match followPath's starting bearing
 * mapAnimations.flyTo({
 *   center: startPosition,
 *   bearing: bearing,  // Seamless transition to followPath
 * })
 */
export function calculateFollowBearing(
  startCoord: [number, number],
  route: [number, number][],
  lookAheadFraction: number,
): number {
  try {
    // Validate inputs
    if (!route || route.length < 2) {
      console.warn(
        "calculateFollowBearing: Route must contain at least 2 coordinates",
      );
      return 0;
    }

    // Create line string from route
    const lineString = turfLineString(route);

    // Calculate total route distance using Turf.js (in kilometers)
    const totalDistance = turfLength(lineString);

    // Current position is at distance 0 (start)
    const currentDistance = 0;
    const lookAheadDistance = lookAheadFraction * totalDistance;

    // Get current point
    const currentPoint = turfAlong(lineString, currentDistance);
    if (!currentPoint?.geometry?.coordinates) {
      console.warn("calculateFollowBearing: Could not calculate current point");
      return 0;
    }

    const currentCoords = currentPoint.geometry.coordinates as [number, number];

    // Get look-ahead point
    const lookAheadPoint = turfAlong(
      lineString,
      Math.min(currentDistance + lookAheadDistance, totalDistance),
    );
    if (!lookAheadPoint?.geometry?.coordinates) {
      console.warn(
        "calculateFollowBearing: Could not calculate look-ahead point",
      );
      return 0;
    }

    const lookAheadCoords = lookAheadPoint.geometry.coordinates as [
      number,
      number,
    ];

    // Calculate bearing from current to look-ahead point
    return calculateBearing(currentCoords, lookAheadCoords);
  } catch (error) {
    console.error("calculateFollowBearing: Error calculating bearing", error);
    return 0;
  }
}
