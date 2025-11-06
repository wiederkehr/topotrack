import type { Map as MapboxGLMap } from "mapbox-gl";

import { createMapboxAnimationPromise } from "../helpers";

/**
 * Play easeTo animation using native Mapbox GL method
 * Provides smooth linear animation without the 3D flight effect
 *
 * @param map - Mapbox GL map instance
 * @param options - Mapbox easeTo options (center, zoom, bearing, pitch, duration, etc.)
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
): Promise<void> {
  const duration = options.duration ?? 500; // Default Mapbox duration

  return createMapboxAnimationPromise(duration, (onComplete) => {
    const optionsWithCallback = {
      ...options,
      complete: onComplete,
    } as Parameters<MapboxGLMap["easeTo"]>[0] & { complete: () => void };
    map.easeTo(optionsWithCallback);
  });
}
