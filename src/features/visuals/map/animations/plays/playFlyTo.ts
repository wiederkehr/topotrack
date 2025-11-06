import type { Map as MapboxGLMap } from "mapbox-gl";

import { createMapboxAnimationPromise } from "../helpers";

/**
 * Play flyTo animation using native Mapbox GL method
 * Provides smooth 3D flight animation from current to target location
 *
 * @param map - Mapbox GL map instance
 * @param options - Mapbox flyTo options (center, zoom, bearing, pitch, duration, etc.)
 * @param signal - Optional AbortSignal for cancellation
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playFlyTo(map, {
 *   center: [-74.5, 40],
 *   zoom: 12,
 *   duration: 2000
 * });
 */
export async function playFlyTo(
  map: MapboxGLMap,
  options: Parameters<MapboxGLMap["flyTo"]>[0],
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const duration = options.duration ?? 2000; // Default Mapbox duration

  return createMapboxAnimationPromise(duration, (onComplete) => {
    const optionsWithCallback = {
      ...options,
      complete: () => {
        // Check abort before calling complete
        if (!signal?.aborted) {
          onComplete();
        }
      },
    } as Parameters<MapboxGLMap["flyTo"]>[0] & { complete: () => void };
    map.flyTo(optionsWithCallback);
  });
}
