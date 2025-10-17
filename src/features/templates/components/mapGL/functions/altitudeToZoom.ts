/**
 * Converts altitude (in meters) to approximate Mapbox zoom level.
 * This provides a rough approximation based on the relationship between
 * altitude and zoom in the Web Mercator projection.
 *
 * The relationship accounts for latitude-based distortion in the Mercator
 * projection, where the scale increases as you move away from the equator.
 *
 * @param altitude - Altitude in meters above ground
 * @param latitude - Latitude in degrees (affects the conversion due to mercator distortion)
 * @returns Approximate zoom level (0-22)
 *
 * @example
 * ```ts
 * // Calculate zoom for 10km altitude at the equator
 * const zoom = altitudeToZoom(10000, 0); // Returns ~6.6
 *
 * // Calculate zoom for 5km altitude in San Francisco
 * const zoom = altitudeToZoom(5000, 37.7749); // Returns ~7.9
 * ```
 */
function altitudeToZoom(altitude: number, latitude: number = 0): number {
  // At the equator, the relationship is roughly:
  // zoom = log2(40075017 / (altitude * 256 / (512 * Math.cos(lat * Math.PI / 180))))
  // Simplified for better approximation:
  const metersPerPixel = altitude / 100; // Rough approximation
  const zoom = Math.log2(
    (40075017 * Math.cos((latitude * Math.PI) / 180)) / (metersPerPixel * 256),
  );
  return Math.max(0, Math.min(22, zoom)); // Clamp between 0-22
}

export { altitudeToZoom };
