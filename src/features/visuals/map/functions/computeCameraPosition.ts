import type { PositionType } from "./types";

type ComputeCameraPositionProps = {
  /** Distance in meters above the ground */
  altitude: number;
  /** Rotation angle in degrees (0 = north) */
  bearing: number;
  /** Tilt angle in degrees (0 = looking straight down, 60 = looking at horizon) */
  pitch: number;
  /** Smoothing factor (0-1) for interpolating between positions */
  smooth?: number;
  /** The geographic position the camera should look at */
  targetPosition: PositionType;
};

let previousCameraPosition: PositionType | undefined;

/**
 * Linear interpolation between two values
 */
function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

/**
 * Computes the camera's ground position to view a target from a given altitude, bearing, and pitch.
 * This is used with Mapbox's FreeCameraOptions API to create 3D camera animations.
 *
 * The calculation offsets the camera position behind and above the target based on the pitch angle,
 * ensuring the target remains in view during 3D camera movements.
 *
 * @param props - Camera positioning parameters
 * @returns The geographic position where the camera should be placed
 *
 * @example
 * ```ts
 * const cameraPos = computeCameraPosition({
 *   targetPosition: { lng: -122.4194, lat: 37.7749 },
 *   altitude: 5000,
 *   bearing: 0,
 *   pitch: 60,
 * });
 * ```
 */
function computeCameraPosition({
  targetPosition,
  altitude,
  bearing,
  pitch,
  smooth,
}: ComputeCameraPositionProps): PositionType {
  // Convert degrees to radians
  const bearingInRadian = (bearing * Math.PI) / 180;
  const pitchInRadian = ((90 - pitch) * Math.PI) / 180;

  // Calculate the horizontal distance from target based on altitude and pitch
  const horizontalDistance = altitude / Math.tan(pitchInRadian);

  // Calculate offset in degrees (approximate conversion at equator)
  // Position camera BEHIND the target (opposite direction of bearing)
  // so that when it looks forward (in bearing direction), target is in view
  // These are rough approximations; more precise calculations would use proper
  // geodesic math, but this is sufficient for map animations
  const lngDiff = -(horizontalDistance * Math.sin(bearingInRadian)) / 111320; // meters per degree longitude at equator
  const latDiff = -(horizontalDistance * Math.cos(bearingInRadian)) / 110574; // meters per degree latitude

  let correctedLng = targetPosition.lng + lngDiff;
  let correctedLat = targetPosition.lat + latDiff;

  // Apply smoothing if enabled and we have a previous position
  if (smooth && previousCameraPosition) {
    correctedLng = lerp(previousCameraPosition.lng, correctedLng, smooth);
    correctedLat = lerp(previousCameraPosition.lat, correctedLat, smooth);
  }

  const newCameraPosition: PositionType = {
    lat: correctedLat,
    lng: correctedLng,
  };

  previousCameraPosition = newCameraPosition;

  return newCameraPosition;
}

/**
 * Resets the internal state used for camera position smoothing.
 * Call this at the start of a new animation sequence to prevent
 * smoothing from the previous sequence's final position.
 */
function resetCameraPositionState(): void {
  previousCameraPosition = undefined;
}

export { computeCameraPosition, resetCameraPositionState };
