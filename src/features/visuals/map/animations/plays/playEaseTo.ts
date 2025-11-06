import type { Map as MapboxGLMap } from "mapbox-gl";

import { createMapboxAnimationPromise } from "../helpers";

/**
 * Play easeTo animation using native Mapbox GL method
 * Provides smooth linear animation without the 3D flight effect
 *
 * @param map - Mapbox GL map instance
 * @param options - Mapbox easeTo options (center, zoom, bearing, pitch, duration, etc.)
 * @param signal - Optional AbortSignal for cancellation
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playEaseTo(map, {
 *   center: [-74.5, 40],
 *   zoom: 12,
 *   duration: 500
 * });
 */
export async function playEaseTo(
  map: MapboxGLMap,
  options: Parameters<MapboxGLMap["easeTo"]>[0],
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const duration = options.duration ?? 500; // Default Mapbox duration

  return createMapboxAnimationPromise(
    map,
    duration,
    (onComplete) => {
      const optionsWithCallback = {
        ...options,
        complete: () => {
          // Check abort before calling complete
          if (!signal?.aborted) {
            onComplete();
          }
        },
      } as Parameters<MapboxGLMap["easeTo"]>[0] & { complete: () => void };
      map.easeTo(optionsWithCallback);
    },
    signal,
  );
}
