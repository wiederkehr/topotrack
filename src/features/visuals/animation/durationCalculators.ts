import { bearing as calculateBearing, length, lineString } from "@turf/turf";

/**
 * Generic duration calculators for animation phases.
 * These functions automatically calculate appropriate animation durations
 * based on route characteristics, eliminating hard-coded values.
 */

/**
 * Calculate the complexity of a route based on directional changes.
 * More turns and direction changes = higher complexity.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @returns Complexity score from 0 (straight line) to 1 (very complex)
 */
function calculateRouteComplexity(routeData: [number, number][]): number {
  if (routeData.length < 3) return 0;

  let totalAngleChange = 0;
  const samplePoints = Math.min(routeData.length, 50); // Sample up to 50 points
  const step = Math.floor(routeData.length / samplePoints);

  for (let i = step; i < routeData.length - step; i += step) {
    const prev = routeData[i - step]!;
    const curr = routeData[i]!;
    const next = routeData[i + step]!;

    // Calculate bearing change between consecutive segments
    const bearing1 = calculateBearing(prev, curr);
    const bearing2 = calculateBearing(curr, next);

    // Calculate the smallest angle difference (accounting for 360° wrap)
    let angleDiff = Math.abs(bearing2 - bearing1);
    if (angleDiff > 180) angleDiff = 360 - angleDiff;

    totalAngleChange += angleDiff;
  }

  // Normalize: A route with constant 90° turns at every sample would score ~1.0
  const avgAngleChange = totalAngleChange / samplePoints;
  return Math.min(avgAngleChange / 90, 1);
}

/**
 * Duration calculator for flyTo phase.
 * Fixed duration for camera fly-in animation.
 *
 * @returns Duration in milliseconds
 */
export function calculateFlyToDuration(): number {
  return 2000; // 2 seconds
}

/**
 * Duration calculator for followPath phase.
 * Dynamic duration based on route length and complexity.
 *
 * Longer routes get more time to showcase the path.
 * More complex routes (more turns) get additional time.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @returns Duration in milliseconds (4-15 seconds)
 */
export function calculateFollowPathDuration(
  routeData: [number, number][],
): number {
  // Calculate route length in kilometers
  const lineStr = lineString(routeData);
  const routeLength = length(lineStr);

  // Calculate route complexity (0-1 score)
  const complexity = calculateRouteComplexity(routeData);

  // Base duration: 1 second per kilometer
  const baseDuration = routeLength * 1000;

  // Complexity multiplier: complex routes get 20-50% more time
  const complexityMultiplier = 1 + complexity * 0.3;

  // Apply multiplier and clamp to reasonable range
  const duration = baseDuration * complexityMultiplier;

  // Minimum 4 seconds (short routes still need time to be visible)
  // Maximum 15 seconds (long routes shouldn't drag on)
  return Math.min(Math.max(duration, 4000), 15000);
}

/**
 * Duration calculator for fitBounds phase.
 * Fixed duration for zoom-out animation.
 *
 * @returns Duration in milliseconds
 */
export function calculateFitBoundsDuration(): number {
  return 2000; // 2 seconds
}

/**
 * Calculate total animation duration by summing all phase durations.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @returns Total duration in milliseconds
 */
export function calculateTotalDuration(routeData: [number, number][]): number {
  return (
    calculateFlyToDuration() +
    calculateFollowPathDuration(routeData) +
    calculateFitBoundsDuration()
  );
}
