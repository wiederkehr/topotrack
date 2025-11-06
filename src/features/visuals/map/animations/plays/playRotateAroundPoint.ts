import type { Map as MapboxGLMap } from "mapbox-gl";

import { createRAFAnimation } from "../helpers";
import type { RotateAroundPointOptions } from "../types";

/**
 * Rotate the map around a point
 * Uses requestAnimationFrame for smooth continuous rotation
 *
 * @param map - Mapbox GL map instance
 * @param options - RotateAroundPoint options (degrees, duration, bearing)
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playRotateAroundPoint(map, {
 *   degrees: 360,
 *   duration: 5000,
 *   bearing: 0
 * });
 */
export async function playRotateAroundPoint(
  map: MapboxGLMap,
  options: RotateAroundPointOptions,
): Promise<void> {
  const startBearing = options.bearing ?? map.getBearing();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, options.duration + 100); // Fallback timeout

    createRAFAnimation((currentTime, progress) => {
      // Calculate current bearing based on progress
      const currentBearing = startBearing + options.degrees * progress;

      // Update map bearing
      map.rotateTo(currentBearing, { duration: 0 });
    }, options.duration)
      .then(() => {
        clearTimeout(timeoutId);
        resolve();
      })
      .catch(() => {
        clearTimeout(timeoutId);
      });
  });
}
