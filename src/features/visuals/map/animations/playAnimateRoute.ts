import { lineString as turfLineString, point as turfPoint } from "@turf/turf";
import type { Map as MapboxGLMap } from "mapbox-gl";

import { normalizedRoutePoints } from "./routeCalculations";
import type { AnimateRouteOptions } from "./types";

/**
 * Play animateRoute animation
 * Synchronously animates both a path and a point along a route
 * Both update in the same RAF frame, ensuring perfect synchronization
 *
 * @param map - Mapbox GL map instance
 * @param options - AnimateRoute options (route, duration, lineSourceId, pointSourceId)
 * @returns Promise that resolves when animation completes
 *
 * @example
 * await playAnimateRoute(map, {
 *   route: [[0, 0], [1, 1], [2, 2]],
 *   duration: 5000,
 *   lineSourceId: 'path-source',
 *   pointSourceId: 'point-source'
 * });
 */
export async function playAnimateRoute(
  map: MapboxGLMap,
  options: AnimateRouteOptions,
): Promise<void> {
  const {
    route,
    duration,
    lineSourceId: lineId,
    pointSourceId: pointId,
  } = options;
  const normalizedRoute = normalizedRoutePoints(route, duration / 16);
  const normalizedRouteLength = normalizedRoute.length;

  // Initialize path coordinates and GeoJSON
  const pathCoordinates: Array<[number, number]> = normalizedRoute.slice(0, 2);
  const pathGeoJSON = turfLineString(pathCoordinates);

  // Initialize point GeoJSON
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

      // Update path coordinates incrementally
      while (pathCoordinates.length <= currentPosition) {
        const point = normalizedRoute[pathCoordinates.length];
        if (point) {
          pathCoordinates.push(point);
        } else {
          break;
        }
      }

      // Update point position
      const currentPoint = normalizedRoute[currentPosition];
      if (currentPoint) {
        pointGeoJSON.geometry.coordinates = currentPoint;
      }

      // Update both sources in the same frame
      const lineSource = map.getSource(lineId);
      if (lineSource && "setData" in lineSource) {
        lineSource.setData(pathGeoJSON);
      }

      const pointSource = map.getSource(pointId);
      if (pointSource && "setData" in pointSource) {
        pointSource.setData(pointGeoJSON);
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
