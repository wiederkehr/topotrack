import { bearing as turfBearing } from "@turf/turf";

/**
 * Calculate bearing between two coordinates in degrees
 * Uses Turf.js bearing calculation which measures clockwise from north
 *
 * @param from - Starting coordinate [lng, lat]
 * @param to - Ending coordinate [lng, lat]
 * @returns Bearing in degrees (may be negative, caller should normalize to 0-360 if needed)
 */
export function calculateBearing(
  from: [number, number],
  to: [number, number],
): number {
  return turfBearing(
    { type: "Point", coordinates: from },
    { type: "Point", coordinates: to },
  );
}

/**
 * Damp bearing changes for smooth camera rotation
 * Uses time-based exponential decay to prevent jerky transitions
 * The damping factor represents a time constant: higher values = longer smoothing duration
 *
 * @param currentBearing - Current bearing in degrees (0-360)
 * @param targetBearing - Target bearing in degrees (0-360)
 * @param damping - Damping factor (0-1, interpreted as time constant)
 *   - 0.5 = Quick response (~167ms to 63% of target at 60fps)
 *   - 0.7 = Balanced response (~583ms to 63% of target)
 *   - 0.85 = Smooth response (~1.1s to 63% of target)
 *   - 0.95 = Very smooth response (~3.2s to 63% of target)
 * @param deltaTime - Time elapsed since last frame in milliseconds (default: 16.67 for 60fps)
 * @returns Dampened bearing in degrees (0-360)
 */
export function dampBearing(
  currentBearing: number,
  targetBearing: number,
  damping: number,
  deltaTime: number = 16.67,
): number {
  let diff = targetBearing - currentBearing;

  // Normalize to -180 to 180 range for shortest path
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  // Calculate smoothing factor using exponential decay
  // Higher damping = slower response (larger time constant)
  // Formula: factor = 1 - exp(-deltaTime / (damping * timeConstant))
  // where timeConstant is scaled based on damping factor
  const timeConstant = damping * 100; // Scale damping to milliseconds
  const factor = 1 - Math.exp(-deltaTime / timeConstant);

  // Apply smoothing: lerp from current toward target
  const smoothedBearing = currentBearing + diff * factor;

  // Normalize to 0-360 range
  return ((smoothedBearing % 360) + 360) % 360;
}
