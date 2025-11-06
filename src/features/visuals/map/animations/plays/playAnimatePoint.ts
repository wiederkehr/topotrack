import { point as turfPoint } from "@turf/turf";
import type { Map as MapboxGLMap } from "mapbox-gl";

import { normalizedRoutePoints } from "../routeCalculations";
import type { AnimatePointOptions } from "../types";

/**
 * Play animatePoint animation
 * Animates a point source along a route using live-update approach
 * The point represents the current position along the route
 *
 * @param map - Mapbox GL map instance
 * @param options - AnimatePoint options (route, duration, pointSourceId)
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playAnimatePoint(map, {
 *   route: [[0, 0], [1, 1], [2, 2]],
 *   duration: 5000,
 *   pointSourceId: 'point-source'
 * });
 */
export async function playAnimatePoint(
  map: MapboxGLMap,
  options: AnimatePointOptions,
): Promise<void> {
  const { route, duration, pointSourceId } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;
  const pointGeoJSON = turfPoint([0, 0]);

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
      const point = normalizedRoute[currentPosition];
      if (point) {
        pointGeoJSON.geometry.coordinates = point;
        const source = map.getSource(pointSourceId);
        if (source && "setData" in source) {
          source.setData(pointGeoJSON);
        }
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
