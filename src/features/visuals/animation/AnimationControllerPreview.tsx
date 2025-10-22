/**
 * Animation Controller - Preview Mode Only
 *
 * Simplified controller that handles real-time animation playback.
 * - Uses pre-calculated keyframes for smooth interpolation
 * - Single RAF loop with no per-frame calculations
 * - Export mode handled by separate ExportAnimationController
 *
 * Key design: Let Mapbox GL do what it does best (smooth interpolation)
 * by feeding it gradual updates instead of fighting its native animations.
 */

import { lineString } from "@turf/turf";
import type { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useMemo } from "react";

import { useTemplateStore } from "@/stores";

import {
  interpolateCameraKeyframes,
  interpolateProgressKeypoints,
  type PreCalculatedAnimation,
} from "./preCalculator";
import type { FitBoundsParams } from "./types";

type AnimationControllerPreviewProps = {
  map: MapboxMap | null;
  preCalculated: PreCalculatedAnimation;
};

/**
 * Preview animation controller - handles real-time playback with RAF.
 * Does NOT handle export mode (that's handled by ExportAnimationController).
 *
 * Architecture:
 * - Subscribes to animation state changes (play/pause/stop)
 * - Uses RAF to drive animation at screen refresh rate
 * - Interpolates between pre-calculated keyframes
 * - Updates map camera and progress indicators smoothly
 */
export function AnimationControllerPreview({
  preCalculated,
  map,
}: AnimationControllerPreviewProps) {
  // Get animation state and position from template store
  const animationState = useTemplateStore((state) => state.animationState);
  const animationPosition = useTemplateStore(
    (state) => state.animationPosition,
  );
  const updateAnimationPosition = useTemplateStore(
    (state) => state.updateAnimationPosition,
  );

  // Extract just the followPath phase keyframes (what we animate with)
  const followPathKeyframes = useMemo(() => {
    return preCalculated.cameraKeyframes;
  }, [preCalculated.cameraKeyframes]);

  const followPathProgressKeypoints = useMemo(() => {
    return preCalculated.progressKeypoints;
  }, [preCalculated.progressKeypoints]);

  const totalDuration = useMemo(() => {
    return preCalculated.totalDuration;
  }, [preCalculated.totalDuration]);

  /**
   * Convert altitude to Mapbox zoom level.
   * Used to translate camera altitude into zoom parameter.
   */
  const altitudeToZoom = useCallback(
    (altitude: number, latitude: number): number => {
      const metersPerPixel =
        (altitude * Math.cos((latitude * Math.PI) / 180)) / 256;
      const zoom = Math.log2(40075016.686 / metersPerPixel) - 8;
      return Math.max(0, Math.min(20, zoom));
    },
    [],
  );

  /**
   * Apply camera state to Mapbox map.
   * Uses easeTo for smooth interpolation between keyframes.
   */
  const applyCameraState = useCallback(
    (state: ReturnType<typeof interpolateCameraKeyframes>) => {
      if (!map) return;

      // Use easeTo with 50ms duration for smooth sub-frame interpolation
      // This bridges the gap between keyframes (which are 50ms apart)
      map.easeTo({
        center: [state.lng, state.lat],
        zoom: altitudeToZoom(state.altitude, state.lat),
        bearing: state.bearing,
        pitch: state.pitch,
        duration: 50,
        easing: (t) => t, // Linear easing for predictable motion
        essential: true,
      });
    },
    [map, altitudeToZoom],
  );

  /**
   * Update progress route and position marker.
   * Uses pre-calculated progress data for smooth visualization.
   */
  const updateProgressVisualization = useCallback(
    (progress: ReturnType<typeof interpolateProgressKeypoints>) => {
      if (!map) return;

      // Update progress route (the line showing completed path)
      const progressSource = map.getSource("route-source-progress");
      if (progressSource && progressSource.type === "geojson") {
        progressSource.setData(lineString(progress.routeCoordinates));
      }

      // Update position marker (current location on route)
      const positionSource = map.getSource("position-source");
      if (positionSource && positionSource.type === "geojson") {
        positionSource.setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: progress.position,
          },
          properties: {},
        });
      }
    },
    [map],
  );

  /**
   * Reset animation to initial state.
   */
  const resetAnimation = useCallback(() => {
    if (!map || followPathKeyframes.length === 0) return;

    // Jump to first keyframe position
    const firstKeyframe = followPathKeyframes[0]!;

    map.jumpTo({
      center: [firstKeyframe.lng, firstKeyframe.lat],
      zoom: altitudeToZoom(firstKeyframe.altitude, firstKeyframe.lat),
      bearing: firstKeyframe.bearing,
      pitch: firstKeyframe.pitch,
    });

    // Reset progress visualization to start
    if (followPathProgressKeypoints.length > 0) {
      const firstKeypoint = followPathProgressKeypoints[0]!;
      updateProgressVisualization({
        routeCoordinates: firstKeypoint.routeCoordinates,
        position: firstKeypoint.position,
      });
    }

    updateAnimationPosition(0);
  }, [
    map,
    followPathKeyframes,
    followPathProgressKeypoints,
    altitudeToZoom,
    updateAnimationPosition,
    updateProgressVisualization,
  ]);

  /**
   * Main RAF animation loop for preview mode.
   * Drives animation by interpolating keyframes at screen refresh rate.
   */
  useEffect(() => {
    // Only animate in preview mode, not in export mode
    if (animationState === "stopped") {
      resetAnimation();
      return;
    }

    if (animationState !== "playing" && animationState !== "paused") {
      return;
    }

    if (!map) return;
    if (followPathKeyframes.length === 0) return;

    let animationFrameId: number;
    let lastFrameTime: number | undefined;
    let isPaused = animationState === "paused";

    const animate = (currentTime: number) => {
      // Handle pause state
      if (animationState === "paused") {
        if (!isPaused) {
          isPaused = true;
        }
        // Keep requesting frames to detect resume
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Handle resume from pause
      if (isPaused && animationState === "playing") {
        isPaused = false;
        lastFrameTime = undefined; // Reset timing
      }

      // Initialize timing on first frame or after resume
      if (!lastFrameTime) {
        lastFrameTime = currentTime - animationPosition;
      }

      const elapsed = currentTime - lastFrameTime;

      if (elapsed < totalDuration) {
        // Determine which phase we're in and interpolate accordingly
        let phaseElapsed = 0;

        // Phases: 0=flyTo, 1=followPath, 2=fitBounds
        for (const phase of preCalculated.config.phases) {
          if (elapsed < phaseElapsed + phase.duration) {
            // We're in this phase
            const phaseTimestamp = elapsed - phaseElapsed;

            if (phase.type === "followPath") {
              // Interpolate camera from pre-calculated keyframes
              const cameraState = interpolateCameraKeyframes(
                followPathKeyframes,
                phaseTimestamp,
              );
              applyCameraState(cameraState);

              // Update progress visualization
              const progress = interpolateProgressKeypoints(
                followPathProgressKeypoints,
                phaseTimestamp,
              );
              updateProgressVisualization(progress);
            } else if (phase.type === "fitBounds") {
              // For fitBounds, use native Mapbox method once
              if (phaseTimestamp < 50) {
                // First frame of phase
                const params = phase.params as FitBoundsParams;
                map.fitBounds(
                  [
                    [params.boundsWest, params.boundsSouth],
                    [params.boundsEast, params.boundsNorth],
                  ],
                  {
                    padding: {
                      top: params.paddingTop,
                      bottom: params.paddingBottom,
                      left: params.paddingLeft,
                      right: params.paddingRight,
                    },
                    bearing: params.bearing,
                    pitch: params.pitch,
                    duration: phase.duration,
                    essential: true,
                  },
                );
              }
              // Let Mapbox handle the animation from here
            } else if (phase.type === "flyTo") {
              // FlyTo is handled by initial setup, just continue
              // (could add interpolation here if needed)
            }

            break;
          }

          phaseElapsed += phase.duration;
        }

        updateAnimationPosition(elapsed);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete - update to final position
        updateAnimationPosition(totalDuration);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, animationState, animationPosition]);

  // This component only manages animation state, renders nothing
  return null;
}
