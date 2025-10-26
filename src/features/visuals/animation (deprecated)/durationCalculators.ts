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
 * Duration curve configuration for route animations.
 * Adjust these values to fine-tune animation timing across different route lengths.
 */
const DURATION_CURVE = {
  // Reference points: [distance in km, ideal duration in seconds]
  shortRoute: { km: 10, seconds: 4 },
  averageRoute: { km: 25, seconds: 10 },
  longRoute: { km: 130, seconds: 60 },

  // Clamping bounds
  minDuration: 4000, // 4 seconds minimum
  maxDuration: 60000, // 1 minute maximum

  // Complexity multiplier range
  complexityImpact: 0.3, // 0-30% extra time for complex routes
};

/**
 * Calculate ideal duration using a smooth curve based on route length.
 * Uses logarithmic interpolation for natural scaling across wide distance ranges.
 *
 * @param routeLength - Route length in kilometers
 * @returns Duration in milliseconds (before complexity adjustment)
 */
function calculateCurveDuration(routeLength: number): number {
  const { shortRoute, averageRoute, longRoute } = DURATION_CURVE;

  // Handle edge cases
  if (routeLength <= shortRoute.km) {
    // For very short routes, use linear interpolation from 0 to short
    const ratio = routeLength / shortRoute.km;
    return ratio * shortRoute.seconds * 1000;
  }

  if (routeLength >= longRoute.km) {
    // For very long routes, use linear interpolation beyond long point
    const ratio = Math.min(
      (routeLength - longRoute.km) / (longRoute.km * 0.5),
      1,
    );
    return longRoute.seconds * 1000 + ratio * (longRoute.seconds * 1000 * 0.2);
  }

  // For routes between short and long, use logarithmic curve
  // This provides smooth acceleration through the middle ranges
  if (routeLength <= averageRoute.km) {
    // Curve from short to average
    const logRange = Math.log(averageRoute.km / shortRoute.km);
    const logPosition = Math.log(routeLength / shortRoute.km);
    const t = logPosition / logRange;

    // Smooth interpolation using smoothstep
    const easedT = t * t * (3 - 2 * t);
    return (
      (shortRoute.seconds +
        easedT * (averageRoute.seconds - shortRoute.seconds)) *
      1000
    );
  } else {
    // Curve from average to long
    const logRange = Math.log(longRoute.km / averageRoute.km);
    const logPosition = Math.log(routeLength / averageRoute.km);
    const t = logPosition / logRange;

    // Smooth interpolation using smoothstep
    const easedT = t * t * (3 - 2 * t);
    return (
      (averageRoute.seconds +
        easedT * (longRoute.seconds - averageRoute.seconds)) *
      1000
    );
  }
}

/**
 * Duration calculator for followPath phase.
 * Dynamic duration based on route length and complexity using a configurable curve.
 *
 * Longer routes get more time to showcase the path.
 * More complex routes (more turns) get additional time.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @returns Duration in milliseconds (4-60 seconds)
 */
export function calculateFollowPathDuration(
  routeData: [number, number][],
): number {
  // Calculate route length in kilometers
  const lineStr = lineString(routeData);
  const routeLength = length(lineStr);

  // Calculate route complexity (0-1 score)
  const complexity = calculateRouteComplexity(routeData);

  // Get base duration from curve
  const baseDuration = calculateCurveDuration(routeLength);

  // Complexity multiplier: complex routes get extra time
  const complexityMultiplier = 1 + complexity * DURATION_CURVE.complexityImpact;

  // Apply multiplier
  const duration = baseDuration * complexityMultiplier;

  // Clamp to reasonable range
  return Math.min(
    Math.max(duration, DURATION_CURVE.minDuration),
    DURATION_CURVE.maxDuration,
  );
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
