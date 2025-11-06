import { lineString as turfLineString } from "@turf/turf";

/**
 * Earth's radius in kilometers
 * Used for Haversine formula calculations
 */
export const EARTH_RADIUS_KM = 6371;

/**
 * Calculate total distance of a LineString in kilometers
 * Uses Haversine formula via segment-by-segment calculation
 *
 * @param lineString - Turf.js LineString feature
 * @returns Distance in kilometers
 */
export function calculateLineDistance(
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
 * Uses Haversine formula for great-circle distance
 *
 * @param coord1 - [longitude, latitude]
 * @param coord2 - [longitude, latitude]
 * @returns Distance in kilometers
 */
export function calculateSegmentDistance(
  coord1: [number, number],
  coord2: [number, number],
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = EARTH_RADIUS_KM;
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
