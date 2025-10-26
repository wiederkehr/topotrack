import { along as turfAlong, lineString as turfLineString } from "@turf/turf";

/**
 * Coordinate sequence for live-update animations
 * Contains individual coordinates to be added incrementally during animation
 * Optimized for Mapbox GL JS live-update performance pattern
 */
export type CoordinateSequence = {
  path: Array<[number, number]>;
  points: Array<[number, number]>;
};

/**
 * Generate coordinate sequence for live-update animations
 * Creates a simplified route and point positions for smooth animation
 * Uses Mapbox live-update approach: incrementally add coordinates and call setData()
 *
 * @param route - Array of [lng, lat] coordinates
 * @param frameCount - Number of animation steps (default: 60 for 60fps @ 1 second)
 * @returns CoordinateSequence with path (simplified route) and point coordinates
 *
 * @example
 * const sequence = generateCoordinateSequence(coordinates, 60);
 * // sequence.path contains simplified route coordinates to add incrementally
 * // sequence.points contains point positions at each animation frame
 */
export function generateCoordinateSequence(
  route: [number, number][],
  frameCount: number = 60,
): CoordinateSequence {
  const lineString = turfLineString(route);
  const totalDistance = calculateLineDistance(lineString);

  // Simplify the route into frameCount coordinates
  // This creates a smooth animation path that follows the original route
  const simplifiedRoute = simplifyRouteByDistance(route, frameCount);

  const pointCoordinates: Array<[number, number]> = [];

  // Generate point positions at each progress step
  for (let i = 0; i <= frameCount; i++) {
    const progress = i / frameCount;
    const distance = totalDistance * progress;

    // Calculate point position at this progress
    const pointFeature = turfAlong(lineString, distance);
    const point = pointFeature.geometry.coordinates as [number, number];
    pointCoordinates.push(point);
  }

  return {
    path: simplifiedRoute,
    points: pointCoordinates,
  };
}

/**
 * Calculate total distance of a LineString in kilometers
 */
function calculateLineDistance(
  lineString: ReturnType<typeof turfLineString>,
): number {
  let distance = 0;
  const coords = lineString.geometry.coordinates as Array<[number, number]>;

  for (let i = 0; i < coords.length - 1; i++) {
    const currentCoord = coords[i];
    const nextCoord = coords[i + 1];
    if (
      currentCoord &&
      nextCoord &&
      currentCoord.length === 2 &&
      nextCoord.length === 2
    ) {
      distance += calculateSegmentDistance(
        [currentCoord[0], currentCoord[1]],
        [nextCoord[0], nextCoord[1]],
      );
    }
  }

  return distance;
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateSegmentDistance(
  coord1: [number, number],
  coord2: [number, number],
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Generate distance-normalized coordinates for smooth position animation
 * Uses Turf.js to calculate point positions at equal distance intervals
 * This ensures constant speed throughout the animation regardless of GPS point density
 *
 * @param route - Array of [lng, lat] coordinates
 * @param frameCount - Number of animation steps (default: 600 for 60fps @ 10 seconds)
 * @returns Array of coordinates at equal distance intervals
 *
 * @example
 * const normalizedRoute = normalizedRoutePoints(coordinates, 600);
 * // normalizedRoute[i] = position at (i/600) * totalDistance along route
 */
export function normalizedRoutePoints(
  route: [number, number][],
  frameCount: number = 600,
): [number, number][] {
  if (route.length === 0) return [];

  const lineString = turfLineString(route);
  const totalDistance = calculateLineDistance(lineString);

  const normalizedRoute: Array<[number, number]> = [];

  // Generate coordinates at equal distance intervals
  for (let i = 0; i <= frameCount; i++) {
    const progress = i / frameCount;
    const distance = totalDistance * progress;

    // Calculate position at this exact distance along the route
    const positionFeature = turfAlong(lineString, distance);
    const position = positionFeature.geometry.coordinates as [number, number];
    normalizedRoute.push(position);
  }

  return normalizedRoute;
}

/**
 * Simplify route into approximately frameCount coordinates
 * Evenly distributes coordinates along the route based on distance
 * This creates a smooth path that can be drawn incrementally
 */
function simplifyRouteByDistance(
  route: [number, number][],
  frameCount: number,
): [number, number][] {
  if (route.length === 0) return [];
  if (route.length <= frameCount + 1) {
    // Route already has few enough points, return as-is
    return route;
  }

  const lineString = turfLineString(route);
  const totalDistance = calculateLineDistance(lineString);
  const targetDistance = totalDistance / frameCount;

  const firstPoint = route[0];
  const simplified: Array<[number, number]> = firstPoint ? [firstPoint] : [];
  let distanceAccumulated = 0;

  for (let i = 1; i < route.length; i++) {
    const coord = route[i];
    const prevCoord = route[i - 1];

    if (coord && prevCoord) {
      distanceAccumulated += calculateSegmentDistance(prevCoord, coord);

      // Add point if we've accumulated enough distance
      if (distanceAccumulated >= targetDistance) {
        simplified.push(coord);
        distanceAccumulated = 0;
      }
    }
  }

  // Always end with last point if not already included
  const lastPoint = route[route.length - 1];
  if (
    lastPoint &&
    simplified.length > 0 &&
    simplified[simplified.length - 1] !== lastPoint
  ) {
    simplified.push(lastPoint);
  }

  return simplified;
}
