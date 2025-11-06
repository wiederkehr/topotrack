import type { Map as MapboxGLMap } from "mapbox-gl";

import { createMapboxAnimationPromise } from "../helpers";
import type { FitBoundsOptions } from "../types";

/**
 * Play fitBounds animation using native Mapbox GL method
 * Smoothly fits the map to show the provided geographic bounds
 *
 * @param map - Mapbox GL map instance
 * @param fitBoundsOptions - FitBounds options (bounds, bearing, pitch, padding, duration, etc.)
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playFitBounds(map, {
 *   bounds: [[-74.5, 40], [-73.5, 41]],
 *   duration: 1000,
 *   bearing: 45,
 *   pitch: 30
 * });
 */
export async function playFitBounds(
  map: MapboxGLMap,
  fitBoundsOptions: FitBoundsOptions,
): Promise<void> {
  const { bounds, duration: customDuration, ...restOptions } = fitBoundsOptions;
  const duration = customDuration ?? 1000; // Default Mapbox duration

  return createMapboxAnimationPromise(duration, (onComplete) => {
    const optionsWithCallback = {
      ...restOptions,
      duration: customDuration,
      complete: onComplete,
    } as Parameters<MapboxGLMap["fitBounds"]>[1] & { complete: () => void };
    map.fitBounds(bounds, optionsWithCallback);
  });
}
