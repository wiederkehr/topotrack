/**
 * Geographic position in WGS84 coordinates
 */
export type PositionType = {
  lat: number;
  lng: number;
};

/**
 * Camera parameters for 3D positioning
 * Note: Uses altitude (meters above ground) instead of zoom levels
 * for smoother 3D camera animations with the FreeCameraOptions API
 */
export type CameraPositionType = {
  /** Distance in meters above the ground */
  altitude: number;
  /** Rotation angle in degrees (0 = north) */
  bearing: number;
  /** Tilt angle in degrees (0 = looking straight down, 60 = looking at horizon) */
  pitch: number;
};
