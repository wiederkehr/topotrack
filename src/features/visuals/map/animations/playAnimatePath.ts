import { lineString as turfLineString } from "@turf/turf";
import type { Map as MapboxGLMap } from "mapbox-gl";

import { normalizedRoutePoints } from "./routeCalculations";
import type { AnimatePathOptions } from "./types";

/**
 * Play animatePath animation
 * Animates a path source along a route using live-update approach
 * The path grows from start to current position as the animation progresses
 *
 * @param map - Mapbox GL map instance
 * @param options - AnimatePath options (route, duration, lineSourceId)
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playAnimatePath(map, {
 *   route: [[0, 0], [1, 1], [2, 2]],
 *   duration: 5000,
 *   lineSourceId: 'path-source'
 * });
 */
export async function playAnimatePath(
  map: MapboxGLMap,
  options: AnimatePathOptions,
): Promise<void> {
  const { route, duration, lineSourceId } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;
  const pathCoordinates: Array<[number, number]> = normalizedRoute.slice(0, 2);
  const pathGeoJSON = turfLineString(pathCoordinates);

  return new Promise((resolve) => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      // Initialize startTime on first frame
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPosition = Math.floor(
        progress * (normalizedRouteLength - 1),
      );

      // Add coordinates incrementally - only push new ones, don't rebuild array
      while (pathCoordinates.length <= currentPosition) {
        const point = normalizedRoute[pathCoordinates.length];
        if (point) {
          pathCoordinates.push(point);
        } else {
          break;
        }
      }

      const source = map.getSource(lineSourceId);
      if (source && "setData" in source) {
        source.setData(pathGeoJSON);
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
