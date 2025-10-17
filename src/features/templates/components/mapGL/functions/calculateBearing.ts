import type { PositionType } from "./types";

/**
 * Calculates the bearing (compass direction) from one point to another.
 * Returns the bearing in degrees where 0° is north, 90° is east, etc.
 *
 * @param from - Starting position
 * @param to - Ending position
 * @returns Bearing in degrees (0-360)
 *
 * @example
 * ```ts
 * const bearing = calculateBearing(
 *   { lat: 37.7749, lng: -122.4194 },
 *   { lat: 37.8049, lng: -122.4094 }
 * ); // Returns bearing from SF to point north-east
 * ```
 */
function calculateBearing(from: PositionType, to: PositionType): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lng1 = (from.lng * Math.PI) / 180;
  const lng2 = (to.lng * Math.PI) / 180;

  const dLng = lng2 - lng1;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = Math.atan2(y, x);

  // Convert from radians to degrees
  bearing = (bearing * 180) / Math.PI;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
}

export { calculateBearing };
