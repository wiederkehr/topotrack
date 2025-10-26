/**
 * Animation Settings
 *
 * Centralized configuration for all animation behavior, inspired by MapDirector.
 * These settings control the camera movement, smoothness, and export quality.
 *
 * Future: Can be migrated to useTemplateStore for user-facing UI controls.
 */

export interface AnimationSettings {
  /**
   * Follow strength controls camera responsiveness and smoothness (0.0-1.0).
   *
   * Low (0.0-0.3): Smooth, laggy camera - anticipates turns far ahead
   *   - lookAheadDistance: 1.5-2.0 km (very wide view of upcoming path)
   *   - bearingDamping: 0.95 (very slow bearing response)
   *   - Feels cinematic and smooth but may seem delayed
   *
   * Medium (0.4-0.6): Balanced - responsive but smooth
   *   - lookAheadDistance: 0.8-1.2 km (looks ahead for upcoming turns)
   *   - bearingDamping: 0.90 (moderate bearing response)
   *   - Default: 0.5 (matches current animation parameters)
   *
   * High (0.7-1.0): Tight, responsive camera - closely follows path
   *   - lookAheadDistance: 0.2-0.5 km (minimal look-ahead)
   *   - bearingDamping: 0.85 (faster bearing response)
   *   - Feels responsive and dynamic but may feel jerky on complex routes
   *
   * Default: 0.5 (balanced, matches current hardcoded values)
   */
  followStrength: number;

  /**
   * Export frame rate for MP4 video.
   * Higher FPS = smoother video but larger file size and longer export time.
   *
   * Common choices:
   * - 15: Cinematic, film-like (smallest file, fastest)
   * - 24: Standard film rate
   * - 25: PAL standard
   * - 30: NTSC standard (default, good balance)
   * - 60: Smooth, modern (largest file, slowest)
   *
   * Default: 30
   */
  fps: 30 | 24 | 25 | 15 | 60;

  /**
   * Speed of route following in km/second.
   * Determines animation duration based on route length.
   * Default: 0.5 km/s → typical 10-15 second animation for 5-10 km route
   *
   * Range: 0.1-2.0 (lower = slower/more scenic, higher = faster/action)
   */
  speed: number;
}

/**
 * Default animation settings.
 * Tuned to match current hardcoded behavior (0.5 km/s speed, balanced smoothness).
 */
export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  speed: 0.5, // 500m per second
  followStrength: 0.5, // Balanced (1km lookahead, 0.85 damping)
  fps: 30, // Standard video framerate
};

/**
 * Derived parameters from followStrength setting.
 * Maps the 0-1 followStrength slider to actual camera parameters.
 */
export function getFollowStrengthParameters(strength: number) {
  // Clamp to valid range
  const s = Math.max(0, Math.min(1, strength));

  return {
    /**
     * Look-ahead distance for bearing calculation (in km).
     * 0.0 (smooth) → 2.0 km
     * 0.5 (balanced) → 1.1 km
     * 1.0 (tight) → 0.2 km
     */
    lookAheadDistance: (1 - s) * 2.0 + s * 0.2,

    /**
     * Bearing damping factor (0.85-0.95).
     * Higher damping (0.95) = slower response, smoother curves
     * Lower damping (0.85) = faster response, tighter follow
     *
     * 0.0 (smooth) → 0.95
     * 0.5 (balanced) → 0.90
     * 1.0 (tight) → 0.85
     */
    bearingDamping: s * 0.1 + 0.85,
  };
}

/**
 * Camera altitude based on follow strength (in meters).
 * Higher altitude = wider view, lower altitude = more detailed view.
 *
 * 0.0 (smooth) → 6000m (very wide view)
 * 0.5 (balanced) → 5000m (good balance)
 * 1.0 (tight) → 4000m (detailed close-up)
 */
export function getCameraAltitude(strength: number): number {
  const s = Math.max(0, Math.min(1, strength));
  return 4000 + (1 - s) * 2000;
}

/**
 * Get all derived parameters for a given followStrength setting.
 * Useful for passing all parameters to pre-calculation functions.
 */
export function getFollowStrengthConfig(strength: number) {
  const params = getFollowStrengthParameters(strength);
  return {
    lookAheadDistance: params.lookAheadDistance,
    bearingDamping: params.bearingDamping,
    cameraAltitude: getCameraAltitude(strength),
  };
}
