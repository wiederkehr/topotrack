import type { Map as MapboxGLMap } from "mapbox-gl";

import { createMapboxAnimationPromise } from "./helpers";
import type { FitBoundsOptions } from "./types";

/**
 * Play flyTo animation using native Mapbox GL method
 * Provides smooth 3D flight animation from current to target location
 *
 * @param map - Mapbox GL map instance
 * @param options - Mapbox flyTo options (center, zoom, bearing, pitch, duration, etc.)
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
): Promise<void> {
  const duration = options.duration ?? 2000; // Default Mapbox duration

  return createMapboxAnimationPromise(duration, (onComplete) => {
    const optionsWithCallback = {
      ...options,
      complete: onComplete,
    } as Parameters<MapboxGLMap["flyTo"]>[0] & { complete: () => void };
    map.flyTo(optionsWithCallback);
  });
}

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
