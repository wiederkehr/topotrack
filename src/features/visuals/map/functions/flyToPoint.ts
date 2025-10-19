import { easeCubicOut } from "d3";
import { Map, MercatorCoordinate } from "mapbox-gl";

import { computeCameraPosition } from "./computeCameraPosition";
import type { CameraPositionType, PositionType } from "./types";

type FlyToPointProps = {
  /** Animation duration in milliseconds */
  duration: number;
  /** Mapbox GL map instance */
  map: Map;
  /** Starting altitude in meters */
  startAltitude: number;
  /** Starting bearing in degrees (0 = north) */
  startBearing: number;
  /** Starting pitch in degrees (0 = looking straight down) */
  startPitch: number;
  /** Ending altitude in meters */
  stopAltitude: number;
  /** Ending bearing in degrees (0 = north) */
  stopBearing: number;
  /** Ending pitch in degrees (0 = looking straight down) */
  stopPitch: number;
  /** Geographic position to fly to */
  targetPosition: PositionType;
};

/**
 * Animates the camera flying to a target position with smooth easing.
 * Uses Mapbox's FreeCameraOptions API for proper 3D camera positioning.
 *
 * @param props - Animation parameters
 * @returns Promise that resolves with final camera position when animation completes
 *
 * @example
 * ```ts
 * await flyToPoint({
 *   map: mapRef.current.getMap(),
 *   targetPosition: { lng: -122.4194, lat: 37.7749 },
 *   duration: 2000,
 *   startAltitude: 10000,
 *   stopAltitude: 5000,
 *   startBearing: 0,
 *   stopBearing: 0,
 *   startPitch: 0,
 *   stopPitch: 60,
 * });
 * ```
 */
function flyToPoint({
  map,
  targetPosition,
  duration,
  startAltitude,
  stopAltitude,
  startBearing,
  stopBearing,
  startPitch,
  stopPitch,
}: FlyToPointProps): Promise<CameraPositionType> {
  return new Promise((resolve) => {
    let startTime: number | undefined;
    let currentAltitude: number;
    let currentBearing: number;
    let currentPitch: number;

    // Calculate the shortest angular difference for bearing interpolation
    // This ensures we rotate in the shortest direction (e.g., 350° -> 10° goes through 0°, not 180°)
    let bearingDiff = stopBearing - startBearing;
    while (bearingDiff > 180) bearingDiff -= 360;
    while (bearingDiff < -180) bearingDiff += 360;

    function frame(currentTime: number) {
      // Set start time
      if (!startTime) startTime = currentTime;

      // Calculate progress
      const progress = (currentTime - startTime) / duration;
      const easedProgress = easeCubicOut(Math.min(progress, 1));

      // Interpolate values
      currentAltitude =
        startAltitude + (stopAltitude - startAltitude) * easedProgress;

      // Interpolate bearing using the shortest angular path
      currentBearing = startBearing + bearingDiff * easedProgress;
      // Normalize to 0-360 range
      currentBearing = (currentBearing + 360) % 360;

      currentPitch = startPitch + (stopPitch - startPitch) * easedProgress;

      // Compute camera position to keep target centered in view
      // When pitch = 0, camera is directly above the target
      // When pitch > 0, camera is positioned behind the target looking forward at it
      const cameraGroundPosition = computeCameraPosition({
        targetPosition,
        altitude: currentAltitude,
        bearing: currentBearing,
        pitch: currentPitch,
      });

      // Use FreeCameraOptions API for proper 3D positioning
      const camera = map.getFreeCameraOptions();

      // Position camera at the computed position (behind target when pitch > 0)
      camera.position = MercatorCoordinate.fromLngLat(
        [cameraGroundPosition.lng, cameraGroundPosition.lat],
        currentAltitude,
      );

      // Set pitch and bearing to look at the target
      camera.setPitchBearing(currentPitch, currentBearing);

      // Apply camera changes
      map.setFreeCameraOptions(camera);

      // Continue animation or resolve promise
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve({
          altitude: currentAltitude,
          bearing: currentBearing,
          pitch: currentPitch,
        });
      }
    }

    requestAnimationFrame(frame);
  });
}

export { flyToPoint };
