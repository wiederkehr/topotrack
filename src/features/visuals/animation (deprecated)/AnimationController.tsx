import type { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useExportStore, useTemplateStore } from "@/stores";

import {
  calculateFitBoundsState,
  calculateFlyToState,
  calculateFollowPathState,
} from "./phaseCalculators";
import type { AnimationConfig, CameraState } from "./types";

type AnimationControllerProps = {
  config: AnimationConfig;
  map: MapboxMap | null;
};

/**
 * AnimationController orchestrates animation playback in two modes:
 * - Preview mode: Uses requestAnimationFrame for smooth real-time playback
 * - Export mode: Renders specific frames at exact timestamps for video export
 *
 * This single component handles both modes, eliminating code duplication.
 * Mode and timestamp are controlled via the useExportStore.
 */
export function AnimationController({ config, map }: AnimationControllerProps) {
  const animationState = useTemplateStore((state) => state.animationState);
  const animationPosition = useTemplateStore(
    (state) => state.animationPosition,
  );
  const updateAnimationPosition = useTemplateStore(
    (state) => state.updateAnimationPosition,
  );

  // Don't subscribe to store - just check it directly to avoid re-renders
  // We only care about export mode in useEffects, not during render
  const mode = "preview"; // Always preview mode, export effects handle export case

  // Track bearing for followPath damping across frames
  const followPathBearingRef = useRef<number | undefined>(undefined);

  /**
   * Calculate camera state at a specific timestamp across all phases
   */
  const calculateStateAtTimestamp = useCallback(
    (ts: number): CameraState | null => {
      if (!map) return null;

      let elapsed = 0;
      let phaseIndex = 0;

      // Find which phase we're in
      for (let i = 0; i < config.phases.length; i++) {
        const phase = config.phases[i]!;
        const phaseDuration = phase.duration;

        if (ts < elapsed + phaseDuration) {
          // We're in this phase
          phaseIndex = i;
          break;
        }

        elapsed += phaseDuration;
      }

      const phase = config.phases[phaseIndex];
      if (!phase) {
        // Animation complete - return final state
        const totalElapsed = config.phases.reduce(
          (sum, p) => sum + p.duration,
          0,
        );
        return calculateStateAtTimestamp(totalElapsed - 1);
      }

      const phaseTimestamp = ts - elapsed;

      // Calculate state based on phase type with proper type narrowing
      if (phase.type === "flyTo") {
        return calculateFlyToState(
          phaseTimestamp,
          phase.duration,
          phase.params as import("./types").FlyToParams,
        );
      } else if (phase.type === "followPath") {
        const result = calculateFollowPathState(
          phaseTimestamp,
          phase.duration,
          phase.params as import("./types").FollowPathParams,
          followPathBearingRef.current,
        );
        // Store bearing for next frame damping
        followPathBearingRef.current = result.nextBearing;
        return result;
      } else if (phase.type === "fitBounds") {
        // Need previous phase's final state as starting point
        const prevState = calculateStateAtTimestamp(elapsed - 1);
        if (!prevState) return null;
        return calculateFitBoundsState(
          phaseTimestamp,
          phase.duration,
          phase.params as import("./types").FitBoundsParams,
          prevState,
        );
      }

      return null;
    },
    [config, map],
  );

  /**
   * Apply camera state to Mapbox map
   */
  const applyCameraState = useCallback(
    (state: CameraState) => {
      if (!map) return;

      // Use easeTo with RAF-interval duration for sub-frame smoothing
      // 16ms matches typical RAF interval (60fps), providing interpolation between frames
      // This smooths out bearing changes while avoiding animation conflicts
      map.easeTo({
        center: [state.lng, state.lat],
        zoom: altitudeToZoom(state.altitude, state.lat),
        bearing: state.bearing,
        pitch: state.pitch,
        duration: 16, // One frame at 60fps
        easing: (t) => t, // Linear easing for predictable motion
        essential: true,
      });
    },
    [map],
  );

  /**
   * Convert altitude in meters to Mapbox zoom level
   * This is a simplified approximation
   */
  const altitudeToZoom = (altitude: number, latitude: number): number => {
    // Mapbox zoom levels: 0 = whole world, 20 = street level
    // Approximate relationship between altitude and zoom
    const metersPerPixel =
      (altitude * Math.cos((latitude * Math.PI) / 180)) / 256;
    const zoom = Math.log2(40075016.686 / metersPerPixel) - 8;
    return Math.max(0, Math.min(20, zoom));
  };

  /**
   * Calculate and expose total animation duration to export store (only when changed)
   */
  const totalDuration = useMemo(
    () => config.phases.reduce((sum, p) => sum + p.duration, 0),
    [config],
  );

  // Only update store if duration actually changed
  useEffect(() => {
    const currentDuration = useExportStore.getState().animationDuration;
    if (currentDuration !== totalDuration) {
      useExportStore.getState().setAnimationDuration(totalDuration);
    }
  }, [totalDuration]);

  /**
   * Helper to determine which phase we're in and handle fitBounds specially
   */
  const applyAnimationAtTimestamp = useCallback(
    (elapsed: number) => {
      if (!map) return;

      // Find which phase we're in
      let phaseElapsed = 0;
      let currentPhase = null;
      let phaseTimestamp = 0;

      for (const phase of config.phases) {
        if (elapsed < phaseElapsed + phase.duration) {
          currentPhase = phase;
          phaseTimestamp = elapsed - phaseElapsed;
          break;
        }
        phaseElapsed += phase.duration;
      }

      if (!currentPhase) return;

      // Handle fitBounds phase using native Mapbox method
      if (currentPhase.type === "fitBounds") {
        const params = currentPhase.params as import("./types").FitBoundsParams;

        // Only call fitBounds once at the very start of the phase
        if (phaseTimestamp === 0 || phaseTimestamp < 16) {
          // First frame only (~16ms = one frame at 60fps)
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
              duration: currentPhase.duration,
              essential: true,
            },
          );
        }
        // During fitBounds, let Mapbox handle the animation
        // Don't call applyCameraState as it would interfere
      } else {
        // For other phases, use calculated state
        const state = calculateStateAtTimestamp(elapsed);
        if (state) {
          applyCameraState(state);
        }
      }
    },
    [map, config, calculateStateAtTimestamp, applyCameraState],
  );

  /**
   * Export mode: Render single frame at specific timestamp
   * Subscribe to export store to detect when we need to render a frame
   */
  useEffect(() => {
    // Subscribe to export store to detect when we need to render a frame
    const unsubscribe = useExportStore.subscribe((state, prevState) => {
      // Only act when exportTimestamp changes in export mode
      if (
        state.exportMode &&
        state.exportTimestamp !== prevState.exportTimestamp
      ) {
        if (map) {
          // Use the same helper that handles fitBounds
          applyAnimationAtTimestamp(state.exportTimestamp);

          // Wait for map to finish rendering before notifying
          const checkRendered = () => {
            if (!map.isMoving()) {
              // Get latest callback from store in case it changed
              const callback = useExportStore.getState().frameReadyCallback;
              callback?.();
            } else {
              map.once("idle", () => {
                // Get latest callback from store in case it changed
                const callback = useExportStore.getState().frameReadyCallback;
                callback?.();
              });
            }
          };
          requestAnimationFrame(checkRendered);
        }
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, applyAnimationAtTimestamp]); // Only re-subscribe if map instance changes

  /**
   * Reset/Stopped mode: Reset map to initial state
   */
  useEffect(() => {
    if (!map) return;
    if (animationState !== "stopped") return;

    // Calculate initial state (timestamp 0)
    const initialState = calculateStateAtTimestamp(0);

    if (initialState) {
      // Reset bearing reference
      followPathBearingRef.current = undefined;

      // Apply initial state to map immediately using jumpTo
      map.jumpTo({
        center: [initialState.lng, initialState.lat],
        zoom: altitudeToZoom(initialState.altitude, initialState.lat),
        bearing: initialState.bearing,
        pitch: initialState.pitch,
      });
    }
  }, [animationState, map, calculateStateAtTimestamp]);

  /**
   * Preview mode: RAF-based real-time animation with play/pause support
   */
  useEffect(() => {
    if (mode !== "preview") return;
    if (!map) return;
    if (animationState === "stopped") return; // Don't animate if stopped

    let animationFrameId: number;
    let lastFrameTime: number | undefined;
    let isPaused = animationState === "paused";

    // Calculate total duration
    const totalDuration = config.phases.reduce((sum, p) => sum + p.duration, 0);

    const animate = (currentTime: number) => {
      // Handle pause state
      if (animationState === "paused") {
        if (!isPaused) {
          // Just paused - update position and stop
          isPaused = true;
        }
        // While paused, keep requesting frames to detect resume
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
        // Find which phase we're in and apply camera state
        let phaseElapsed = 0;
        let currentPhase = null;
        let phaseTimestamp = 0;

        for (const phase of config.phases) {
          if (elapsed < phaseElapsed + phase.duration) {
            currentPhase = phase;
            phaseTimestamp = elapsed - phaseElapsed;
            break;
          }
          phaseElapsed += phase.duration;
        }

        if (currentPhase) {
          // Handle fitBounds phase using native Mapbox method
          if (currentPhase.type === "fitBounds") {
            const params =
              currentPhase.params as import("./types").FitBoundsParams;

            // Only call fitBounds once at the start of the phase
            if (phaseTimestamp < 16) {
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
                  duration: currentPhase.duration,
                  essential: true,
                },
              );
            }
            // During fitBounds, let Mapbox handle the animation
          } else {
            // For other phases, use calculated state
            const state = calculateStateAtTimestamp(elapsed);
            if (state) {
              applyCameraState(state);
            }
          }
        }

        updateAnimationPosition(elapsed);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation completed - update final position
        updateAnimationPosition(totalDuration);
      }
    };

    // Reset bearing reference when animation restarts from position 0
    if (animationPosition === 0) {
      followPathBearingRef.current = undefined;
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map,
    animationState,
    animationPosition,
    // Note: we don't include calculateStateAtTimestamp or applyCameraState
    // to avoid re-running animation when those callbacks are recreated
  ]);

  // This component only manages animation state, renders nothing
  return null;
}
