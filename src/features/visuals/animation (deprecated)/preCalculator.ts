/**
 * Animation Pre-Calculator
 *
 * Pre-computes camera keyframes and progress route waypoints for smooth animation.
 * This eliminates per-frame calculations (bearing, distance, interpolation)
 * and enables perfect sync between preview and frame-by-frame export.
 *
 * Key insight: Complex calculations happen once at setup time, making the
 * animation loop trivial (just array lookups and lerp).
 */

import { along, bbox, length, lineString } from "@turf/turf";

import { calculateBearing } from "../map/utilities/bearing";
import {
  AnimationSettings,
  getFollowStrengthConfig,
} from "./animationSettings";
import {
  calculateFitBoundsDuration,
  calculateFlyToDuration,
} from "./durationCalculators";
import type { AnimationConfig, CameraState, FollowPathParams } from "./types";

/**
 * Camera position and orientation at a specific timestamp.
 * Pre-calculated once and interpolated during animation.
 */
export interface CameraKeyframe {
  altitude: number;
  bearing: number;
  lat: number;
  // ms into followPath phase
  lng: number;
  pitch: number;
  timestamp: number;
}

/**
 * Route progress at a specific timestamp.
 * Pre-sliced and pre-calculated for smooth progress visualization.
 */
export interface ProgressKeypoint {
  // Current position marker
  distance: number;
  // Pre-sliced route up to this point
  position: [number, number];
  // ms into followPath phase
  routeCoordinates: [number, number][];
  timestamp: number; // Distance along route in km
}

/**
 * Complete pre-calculated animation data.
 * Contains everything needed for smooth animation and export.
 */
export interface PreCalculatedAnimation {
  // Camera movement
  cameraKeyframes: CameraKeyframe[];

  // Animation configuration
  config: AnimationConfig;

  // km
  followPathDuration: number;
  fps: number;
  // Route progress visualization
  progressKeypoints: ProgressKeypoint[];

  // Metadata for debugging/inspection
  routeLength: number;
  totalDuration: number;
}

/**
 * Pre-calculates all animation data for smooth playback.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @param settings - Animation settings (speed, smoothness, fps)
 * @returns Pre-calculated animation data
 */
export function preCalculateAnimation(
  routeData: [number, number][],
  settings: AnimationSettings,
): PreCalculatedAnimation {
  if (routeData.length < 2) {
    throw new Error("Route must have at least 2 points");
  }

  // Get follow strength configuration
  const followConfig = getFollowStrengthConfig(settings.followStrength);

  // Calculate phase durations
  const flyToDuration = calculateFlyToDuration();
  const fitBoundsDuration = calculateFitBoundsDuration();

  // Calculate followPath duration from route length and speed
  const routeLine = lineString(routeData);
  const routeLength = length(routeLine); // in km
  const followPathDuration = (routeLength / settings.speed) * 1000; // in ms

  const totalDuration = flyToDuration + followPathDuration + fitBoundsDuration;

  // Pre-calculate camera keyframes for followPath phase
  const cameraKeyframes = generateCameraKeyframes(
    routeData,
    followPathDuration,
    {
      lookAheadDistance: followConfig.lookAheadDistance,
      bearingDamping: followConfig.bearingDamping,
      altitude: followConfig.cameraAltitude,
    },
  );

  // Pre-calculate progress route keypoints
  const progressKeypoints = generateProgressKeypoints(
    routeData,
    followPathDuration,
    settings.fps,
  );

  // Build animation config with calculated durations
  const startPosition = routeData[0]!;
  const routeLine2 = lineString(routeData);
  const bboxArray = bbox(routeLine2);

  const config: AnimationConfig = {
    phases: [
      {
        type: "flyTo",
        duration: flyToDuration,
        params: {
          startAltitude: 10000,
          stopAltitude: followConfig.cameraAltitude,
          startBearing: 0,
          stopBearing: 0, // Will be set by first keyframe
          startPitch: 0,
          stopPitch: 40,
          targetLng: startPosition[0],
          targetLat: startPosition[1],
        },
      },
      {
        type: "followPath",
        duration: followPathDuration,
        params: {
          path: routeLine2,
          altitude: followConfig.cameraAltitude,
          pitch: 40,
          lookAheadDistance: followConfig.lookAheadDistance,
          bearingDamping: followConfig.bearingDamping,
        } as FollowPathParams,
      },
      {
        type: "fitBounds",
        duration: fitBoundsDuration,
        params: {
          boundsWest: bboxArray[0],
          boundsSouth: bboxArray[1],
          boundsEast: bboxArray[2],
          boundsNorth: bboxArray[3],
          bearing: 0,
          pitch: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    ],
  };

  return {
    cameraKeyframes,
    progressKeypoints,
    config,
    totalDuration,
    fps: settings.fps,
    routeLength,
    followPathDuration,
  };
}

/**
 * Generate camera keyframes for the followPath phase.
 * These are interpolated during animation for smooth camera movement.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @param duration - Total followPath duration in ms
 * @param options - Camera parameters
 * @returns Array of camera keyframes
 */
function generateCameraKeyframes(
  routeData: [number, number][],
  duration: number,
  options: {
    altitude: number;
    bearingDamping: number;
    lookAheadDistance: number;
  },
): CameraKeyframe[] {
  const keyframes: CameraKeyframe[] = [];

  // Generate keyframes at regular intervals (50ms = 20 fps for keyframes)
  // This provides good interpolation quality without too much data
  const keyframeInterval = 50;
  const routeLine = lineString(routeData);
  const totalDistance = length(routeLine); // km

  let previousBearing: number | undefined;

  for (let ts = 0; ts <= duration; ts += keyframeInterval) {
    const progress = Math.min(ts / duration, 1);
    const currentDistance = totalDistance * progress;

    // Current position
    const currentPoint = along(routeLine, currentDistance);
    const [lng, lat] = currentPoint.geometry.coordinates as [number, number];

    // Look-ahead point for bearing calculation
    const lookAheadPoint = along(
      routeLine,
      Math.min(currentDistance + options.lookAheadDistance, totalDistance),
    );
    const [nextLng, nextLat] = lookAheadPoint.geometry.coordinates as [
      number,
      number,
    ];

    // Calculate bearing with damping
    const targetBearing = calculateBearing([lng, lat], [nextLng, nextLat]);

    const bearing =
      previousBearing !== undefined
        ? dampBearing(previousBearing, targetBearing, options.bearingDamping)
        : targetBearing;

    previousBearing = bearing;

    keyframes.push({
      timestamp: ts,
      lng,
      lat,
      bearing,
      pitch: 40,
      altitude: options.altitude,
    });
  }

  return keyframes;
}

/**
 * Generate progress route keypoints for visualization.
 * Pre-sliced route coordinates at each animation frame interval.
 *
 * @param routeData - Array of [lng, lat] coordinates
 * @param duration - Total followPath duration in ms
 * @param fps - Frames per second for export
 * @returns Array of progress keypoints
 */
function generateProgressKeypoints(
  routeData: [number, number][],
  duration: number,
  fps: number,
): ProgressKeypoint[] {
  const keypoints: ProgressKeypoint[] = [];

  const routeLine = lineString(routeData);
  const totalDistance = length(routeLine); // km

  // Generate keypoints at frame intervals for smooth progress visualization
  const frameInterval = 1000 / fps; // ms between frames

  // Pre-build cumulative distances for fast lookup
  const cumulativeDistances: number[] = [0];
  for (let i = 1; i < routeData.length; i++) {
    const prev = routeData[i - 1]!;
    const curr = routeData[i]!;
    const segment = lineString([prev, curr]);
    const segmentDistance = length(segment);
    cumulativeDistances.push(cumulativeDistances[i - 1]! + segmentDistance);
  }

  for (let ts = 0; ts <= duration; ts += frameInterval) {
    const progress = Math.min(ts / duration, 1);
    const currentDistance = totalDistance * progress;

    // Find route points up to current progress
    const progressCoordinates: [number, number][] = [];
    let lastIndex = 0;

    for (let i = 0; i < cumulativeDistances.length; i++) {
      if (cumulativeDistances[i]! <= currentDistance) {
        progressCoordinates.push(routeData[i]!);
        lastIndex = i;
      } else {
        break;
      }
    }

    // Add interpolated point for smooth progress line
    if (
      lastIndex < routeData.length - 1 &&
      cumulativeDistances[lastIndex + 1]! > currentDistance
    ) {
      const prevPoint = routeData[lastIndex]!;
      const nextPoint = routeData[lastIndex + 1]!;
      const prevDist = cumulativeDistances[lastIndex]!;
      const nextDist = cumulativeDistances[lastIndex + 1]!;

      const segmentProgress =
        (currentDistance - prevDist) / (nextDist - prevDist);
      const interpolated: [number, number] = [
        prevPoint[0] + (nextPoint[0] - prevPoint[0]) * segmentProgress,
        prevPoint[1] + (nextPoint[1] - prevPoint[1]) * segmentProgress,
      ];

      progressCoordinates.push(interpolated);
    }

    // Current position
    const positionPoint = along(routeLine, currentDistance);
    const position = positionPoint.geometry.coordinates as [number, number];

    keypoints.push({
      timestamp: ts,
      routeCoordinates: progressCoordinates,
      position,
      distance: currentDistance,
    });
  }

  return keypoints;
}

/**
 * Damp bearing changes for smooth camera rotation.
 * Prevents jerky bearing transitions on sharp turns.
 *
 * @param currentBearing - Current bearing in degrees
 * @param targetBearing - Target bearing in degrees
 * @param damping - Damping factor (0.85-0.95, higher = smoother)
 * @returns Dampened bearing in degrees
 */
function dampBearing(
  currentBearing: number,
  targetBearing: number,
  damping: number,
): number {
  let diff = targetBearing - currentBearing;

  // Normalize to -180 to 180 range for shortest path
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  // Apply damping
  const smoothedBearing = currentBearing + diff * (1 - damping);

  // Normalize to 0-360 range
  return ((smoothedBearing % 360) + 360) % 360;
}

/**
 * Interpolate between two camera keyframes.
 * Linear interpolation for smooth camera movement between pre-calculated keyframes.
 *
 * @param keyframes - Array of camera keyframes
 * @param timestamp - Current timestamp in ms
 * @returns Interpolated camera state
 */
export function interpolateCameraKeyframes(
  keyframes: CameraKeyframe[],
  timestamp: number,
): CameraState {
  if (keyframes.length === 0) {
    throw new Error("No keyframes to interpolate");
  }

  // Find surrounding keyframes
  let beforeIdx = 0;
  for (let i = 0; i < keyframes.length; i++) {
    if (keyframes[i]!.timestamp <= timestamp) {
      beforeIdx = i;
    } else {
      break;
    }
  }

  const beforeKeyframe = keyframes[beforeIdx]!;

  // If at or past last keyframe, return it
  if (beforeIdx === keyframes.length - 1) {
    return {
      lng: beforeKeyframe.lng,
      lat: beforeKeyframe.lat,
      bearing: beforeKeyframe.bearing,
      pitch: beforeKeyframe.pitch,
      altitude: beforeKeyframe.altitude,
    };
  }

  const afterKeyframe = keyframes[beforeIdx + 1]!;

  // Calculate interpolation factor
  const timeBetween = afterKeyframe.timestamp - beforeKeyframe.timestamp;
  const timeAfter = timestamp - beforeKeyframe.timestamp;
  const t = timeBetween > 0 ? timeAfter / timeBetween : 0;

  // Lerp all values
  return {
    lng: lerp(beforeKeyframe.lng, afterKeyframe.lng, t),
    lat: lerp(beforeKeyframe.lat, afterKeyframe.lat, t),
    bearing: lerpAngle(beforeKeyframe.bearing, afterKeyframe.bearing, t),
    pitch: lerp(beforeKeyframe.pitch, afterKeyframe.pitch, t),
    altitude: lerp(beforeKeyframe.altitude, afterKeyframe.altitude, t),
  };
}

/**
 * Interpolate between two progress keypoints.
 * Returns the progress route coordinates at the given timestamp.
 *
 * @param keypoints - Array of progress keypoints
 * @param timestamp - Current timestamp in ms
 * @returns Interpolated progress data
 */
export function interpolateProgressKeypoints(
  keypoints: ProgressKeypoint[],
  timestamp: number,
): {
  position: [number, number];
  routeCoordinates: [number, number][];
} {
  if (keypoints.length === 0) {
    throw new Error("No keypoints to interpolate");
  }

  // Find nearest keypoint (progress is visual, so we can just snap to nearest)
  let nearestIdx = 0;
  let nearestDist = Math.abs(keypoints[0]!.timestamp - timestamp);

  for (let i = 1; i < keypoints.length; i++) {
    const dist = Math.abs(keypoints[i]!.timestamp - timestamp);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestIdx = i;
    }
  }

  const keypoint = keypoints[nearestIdx]!;
  return {
    routeCoordinates: keypoint.routeCoordinates,
    position: keypoint.position,
  };
}

/**
 * Lerp (linear interpolation) between two values.
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Lerp for angles, accounting for 360° wrap-around.
 */
function lerpAngle(start: number, end: number, t: number): number {
  let diff = end - start;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  const result = start + diff * t;
  return ((result % 360) + 360) % 360;
}
