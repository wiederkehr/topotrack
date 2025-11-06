import type { Map as MapboxGLMap } from "mapbox-gl";

/**
 * Validates that coordinates are properly formed
 * @param coords - Coordinate tuple to validate
 * @returns true if valid [lng, lat] tuple
 */
export function validateCoordinates(
  coords: unknown,
): coords is [number, number] {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number" &&
    isFinite(coords[0]) &&
    isFinite(coords[1])
  );
}

/**
 * Validates that a route has minimum required coordinates
 * @param route - Route array to validate
 * @param minLength - Minimum number of coordinates required (default: 2)
 * @returns filtered route containing only valid coordinates
 */
export function validateRoute(
  route: unknown[],
  minLength: number = 2,
): [number, number][] {
  if (!route || !Array.isArray(route)) {
    return [];
  }

  const validRoute = route.filter((coord): coord is [number, number] =>
    validateCoordinates(coord),
  );

  if (validRoute.length < minLength) {
    return [];
  }

  return validRoute;
}

/**
 * Creates a promise that wraps a Mapbox native animation
 * Handles both completion callback and timeout fallback
 * @param map - Mapbox GL map instance
 * @param duration - Animation duration in milliseconds
 * @param animationFn - Function that initiates the animation with callback
 */
export function createMapboxAnimationPromise(
  duration: number,
  animationFn: (onComplete: () => void) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, duration + 100); // Slight buffer

    animationFn(() => {
      clearTimeout(timeoutId);
      resolve();
    });
  });
}

/**
 * Creates a RAF-based animation loop that calls a frame function
 * @param frameFn - Function called on each frame with (currentTime, progress)
 * @param duration - Total animation duration in milliseconds
 * @returns Promise that resolves when animation completes
 */
export function createRAFAnimation(
  frameFn: (currentTime: number, progress: number) => void,
  duration: number,
): Promise<void> {
  return new Promise((resolve) => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      try {
        frameFn(currentTime, progress);
      } catch (error) {
        console.error("Error during RAF animation:", error);
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
}

/**
 * Gets a GeoJSON source from the map and validates it supports setData
 * @param map - Mapbox GL map instance
 * @param sourceId - Source ID to retrieve
 * @returns Source object if valid, null otherwise
 */
export function getMapSource(
  map: MapboxGLMap,
  sourceId: string,
): { setData: (data: unknown) => void } | null {
  const source = map.getSource(sourceId);
  if (source && "setData" in source) {
    return source as { setData: (data: unknown) => void };
  }
  return null;
}
