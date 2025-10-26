import type { Feature, LineString } from "geojson";

/**
 * Camera state at any point during animation
 */
export type CameraState = {
  altitude: number;
  bearing: number;
  lat: number;
  lng: number;
  pitch: number;
};

/**
 * Parameters for flyTo animation phase
 */
export type FlyToParams = {
  startAltitude: number;
  startBearing: number;
  startPitch: number;
  stopAltitude: number;
  stopBearing: number;
  stopPitch: number;
  targetLat: number;
  targetLng: number;
};

/**
 * Parameters for followPath animation phase
 */
export type FollowPathParams = {
  altitude: number;
  bearingDamping: number;
  lookAheadDistance: number;
  path: Feature<LineString>;
  pitch: number;
};

/**
 * Parameters for fitBounds animation phase
 */
export type FitBoundsParams = {
  bearing: number;
  boundsEast: number;
  boundsNorth: number;
  boundsSouth: number;
  boundsWest: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  pitch: number;
};

/**
 * Animation phase configuration
 */
export type AnimationPhase = {
  duration: number;
  params: FlyToParams | FollowPathParams | FitBoundsParams;
  type: "flyTo" | "followPath" | "fitBounds";
};

/**
 * Complete animation configuration
 */
export type AnimationConfig = {
  phases: AnimationPhase[];
};
