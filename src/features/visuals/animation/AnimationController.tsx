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
  const replayTrigger = useTemplateStore((state) => state.replayTrigger);

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

      // Use Mapbox's easeTo for smooth transitions in preview mode
      // In export mode, we want instant updates (duration: 0)
      const duration = mode === "preview" ? 50 : 0;

      map.easeTo({
        center: [state.lng, state.lat],
        zoom: altitudeToZoom(state.altitude, state.lat),
        bearing: state.bearing,
        pitch: state.pitch,
        duration,
        essential: true,
      });
    },
    [map, mode],
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
        const frameState = calculateStateAtTimestamp(state.exportTimestamp);

        if (frameState && map) {
          applyCameraState(frameState);

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
  }, [map]); // Only re-subscribe if map instance changes, callbacks are stable via refs

  /**
   * Preview mode: RAF-based real-time animation
   * Only runs on initial mount and when replayTrigger changes
   */
  useEffect(() => {
    if (mode !== "preview") return;
    if (!map) return;

    let animationFrameId: number;
    let startTime: number | undefined;

    // Calculate total duration
    const totalDuration = config.phases.reduce((sum, p) => sum + p.duration, 0);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      if (elapsed < totalDuration) {
        const state = calculateStateAtTimestamp(elapsed);
        if (state) {
          applyCameraState(state);
        }
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Reset bearing reference for new animation
    followPathBearingRef.current = undefined;

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Only re-run when these specific values change
    map,
    replayTrigger,
    // Note: we don't include calculateStateAtTimestamp or applyCameraState
    // to avoid re-running animation when those callbacks are recreated
  ]);

  // This component only manages animation state, renders nothing
  return null;
}
