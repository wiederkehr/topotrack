import type { Map as MapboxGLMap } from "mapbox-gl";

import { createRAFAnimation } from "../helpers";
import type { RotateAroundPointOptions } from "../types";

/**
 * Rotate the map around a point
 * Uses requestAnimationFrame for smooth continuous rotation
 *
 * @param map - Mapbox GL map instance
 * @param options - RotateAroundPoint options (degrees, duration, bearing)
 * @param signal - Optional AbortSignal for cancellation
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
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const startBearing = options.bearing ?? map.getBearing();

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, options.duration + 100); // Fallback timeout

    createRAFAnimation((currentTime, progress) => {
      // Check if abort was requested during animation
      if (signal?.aborted) {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      // Calculate current bearing based on progress
      const currentBearing = startBearing + options.degrees * progress;

      // Update map bearing
      map.rotateTo(currentBearing, { duration: 0 });
    }, options.duration)
      .then(() => {
        clearTimeout(timeoutId);
        resolve();
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        // Re-throw abort errors, swallow others
        if (error instanceof DOMException && error.name === "AbortError") {
          reject(error);
        }
      });
  });
}
