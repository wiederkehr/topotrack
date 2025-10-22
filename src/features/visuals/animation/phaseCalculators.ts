import { along, length } from "@turf/turf";
import { easeCubicOut } from "d3";

import { calculateBearing } from "../map/functions/calculateBearing";
import type {
  CameraState,
  FitBoundsParams,
  FlyToParams,
  FollowPathParams,
} from "./types";

/**
 * Phase calculators - pure functions that calculate camera state at any timestamp.
 * These enable both RAF-based preview animations and frame-by-frame export.
 */

/**
 * Lerp (linear interpolation) between two values
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Lerp for angles, accounting for 360° wrap-around.
 * For example, interpolating between 350° and 10° goes through 0°, not 180°.
 */
function lerpAngle(start: number, end: number, t: number): number {
  let diff = end - start;
  // Normalize to -180 to 180 range for shortest path
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  const result = start + diff * t;
  // Normalize to 0-360 range
  return ((result % 360) + 360) % 360;
}

/**
 * Calculate camera state during flyTo phase.
 * Flies from starting altitude/bearing/pitch to target position.
 *
 * @param timestamp - Milliseconds elapsed in this phase (0 to duration)
 * @param duration - Total duration of this phase in milliseconds
 * @param params - FlyTo parameters
 * @returns Camera state at the given timestamp
 */
export function calculateFlyToState(
  timestamp: number,
  duration: number,
  params: FlyToParams,
): CameraState {
  const progress = Math.min(timestamp / duration, 1);
  const easedProgress = easeCubicOut(progress);

  return {
    altitude: lerp(params.startAltitude, params.stopAltitude, easedProgress),
    bearing: lerpAngle(params.startBearing, params.stopBearing, easedProgress),
    pitch: lerp(params.startPitch, params.stopPitch, easedProgress),
    lng: params.targetLng,
    lat: params.targetLat,
  };
}

/**
 * Damp bearing changes for smooth transitions.
 * Used during followPath to avoid jerky camera rotation.
 *
 * @param currentBearing - Current bearing in degrees
 * @param targetBearing - Target bearing in degrees
 * @param damping - Damping factor (0 = instant, 1 = no change)
 * @returns Smoothed bearing in degrees
 */
function dampBearing(
  currentBearing: number,
  targetBearing: number,
  damping: number,
): number {
  let diff = targetBearing - currentBearing;
  // Normalize to -180 to 180 range
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  // Apply damping
  const smoothedBearing = currentBearing + diff * (1 - damping);

  // Normalize to 0-360 range
  return ((smoothedBearing % 360) + 360) % 360;
}

/**
 * Calculate camera state during followPath phase.
 * Camera follows along the route path at constant altitude and pitch.
 * Bearing adjusts to follow path direction with smooth damping.
 *
 * @param timestamp - Milliseconds elapsed in this phase (0 to duration)
 * @param duration - Total duration of this phase in milliseconds
 * @param params - FollowPath parameters
 * @param previousBearing - Bearing from previous frame (for damping), undefined on first frame
 * @returns Camera state at the given timestamp, plus bearing for next frame
 */
export function calculateFollowPathState(
  timestamp: number,
  duration: number,
  params: FollowPathParams,
  previousBearing?: number,
): CameraState & { nextBearing: number } {
  const progress = Math.min(timestamp / duration, 1);

  // Calculate position along path
  const totalDistance = length(params.path);
  const currentDistance = totalDistance * progress;
  const currentPoint = along(params.path, currentDistance);

  const lng = currentPoint.geometry.coordinates[0] as number;
  const lat = currentPoint.geometry.coordinates[1] as number;

  // Calculate target bearing by looking ahead along path
  const lookAheadPoint = along(
    params.path,
    Math.min(currentDistance + params.lookAheadDistance, totalDistance),
  );
  const nextLng = lookAheadPoint.geometry.coordinates[0] as number;
  const nextLat = lookAheadPoint.geometry.coordinates[1] as number;

  const targetBearing = calculateBearing(
    { lng, lat },
    { lng: nextLng, lat: nextLat },
  );

  // Apply damping to smooth bearing transitions
  const bearing =
    previousBearing !== undefined
      ? dampBearing(previousBearing, targetBearing, params.bearingDamping)
      : targetBearing;

  return {
    altitude: params.altitude,
    bearing,
    pitch: params.pitch,
    lng,
    lat,
    nextBearing: bearing, // Return for use in next frame
  };
}

/**
 * Calculate camera state during fitBounds phase.
 *
 * NOTE: This is a simplified version used only for progress tracking and export.
 * The actual fitBounds animation is handled by Mapbox's native fitBounds() method
 * in AnimationController, which correctly calculates zoom, padding, and transitions.
 *
 * @param timestamp - Milliseconds elapsed in this phase (0 to duration)
 * @param duration - Total duration of this phase in milliseconds
 * @param params - FitBounds parameters
 * @param startState - Camera state at start of this phase
 * @returns Camera state at the given timestamp (position and angles only)
 */
export function calculateFitBoundsState(
  timestamp: number,
  duration: number,
  params: FitBoundsParams,
  startState: CameraState,
): CameraState {
  const progress = Math.min(timestamp / duration, 1);
  const easedProgress = easeCubicOut(progress);

  // Calculate center of bounds
  const centerLng = (params.boundsWest + params.boundsEast) / 2;
  const centerLat = (params.boundsSouth + params.boundsNorth) / 2;

  // Use a high altitude for zoom-out effect
  // Actual zoom level is handled by native fitBounds()
  const targetAltitude = 20000; // Approximate high altitude for overview

  return {
    altitude: lerp(startState.altitude, targetAltitude, easedProgress),
    bearing: lerpAngle(startState.bearing, params.bearing, easedProgress),
    pitch: lerp(startState.pitch, params.pitch, easedProgress),
    lng: lerp(startState.lng, centerLng, easedProgress),
    lat: lerp(startState.lat, centerLat, easedProgress),
  };
}
