import type { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";

import { useTemplateStore } from "@/stores";

import {
  calculateFitBoundsState,
  calculateFlyToState,
  calculateFollowPathState,
} from "./phaseCalculators";
import type { AnimationConfig, CameraState } from "./types";

type AnimationControllerProps = {
  config: AnimationConfig;
  map: MapboxMap | null;
  mode?: "preview" | "export";
  // Export mode props
  onExportFrameReady?: () => void;
  timestamp?: number;
};

/**
 * AnimationController orchestrates animation playback in two modes:
 * - Preview mode: Uses requestAnimationFrame for smooth real-time playback
 * - Export mode: Renders specific frames at exact timestamps for video export
 *
 * This single component handles both modes, eliminating code duplication.
 */
export function AnimationController({
  config,
  map,
  mode = "preview",
  timestamp,
  onExportFrameReady,
}: AnimationControllerProps) {
  const replayTrigger = useTemplateStore((state) => state.replayTrigger);

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
   * Export mode: Render single frame at specific timestamp
   */
  useEffect(() => {
    if (mode !== "export" || timestamp === undefined) return;

    const state = calculateStateAtTimestamp(timestamp);
    if (state) {
      applyCameraState(state);

      // Wait for map to finish rendering before notifying
      if (map) {
        const checkRendered = () => {
          if (!map.isMoving()) {
            onExportFrameReady?.();
          } else {
            map.once("idle", () => onExportFrameReady?.());
          }
        };
        requestAnimationFrame(checkRendered);
      }
    }
  }, [
    mode,
    timestamp,
    calculateStateAtTimestamp,
    applyCameraState,
    map,
    onExportFrameReady,
  ]);

  /**
   * Preview mode: RAF-based real-time animation
   */
  useEffect(() => {
    if (mode !== "preview") return;
    if (!map || replayTrigger === 0) return;

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
  }, [
    mode,
    map,
    config,
    replayTrigger,
    calculateStateAtTimestamp,
    applyCameraState,
  ]);

  // This component only manages animation state, renders nothing
  return null;
}
