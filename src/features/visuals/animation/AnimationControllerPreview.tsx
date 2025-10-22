/**
 * Animation Controller - Preview Mode Only
 *
 * Simplified controller that handles real-time animation playback.
 * - Calculates camera state in real-time per RAF frame (like original)
 * - No per-frame calculations overhead (uses config, not keyframes)
 * - Handles smooth bearing damping across frames
 * - Export mode handled by separate ExportAnimationController
 *
 * Key design: Calculate positions at exact animation timestamps for smooth
 * 60fps motion. Export uses pre-calculated keyframes for deterministic output.
 */

import { along, length, lineString } from "@turf/turf";
import type { Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";

import { useTemplateStore } from "@/stores";

import {
  calculateFitBoundsState,
  calculateFlyToState,
  calculateFollowPathState,
} from "./phaseCalculators";
import type { AnimationConfig, CameraState, FitBoundsParams } from "./types";

type AnimationControllerPreviewProps = {
  config: AnimationConfig;
  map: MapboxMap | null;
};

/**
 * Preview animation controller - handles real-time playback with RAF.
 * Does NOT handle export mode (that's handled by ExportAnimationController).
 *
 * Architecture:
 * - Subscribes to animation state changes (play/pause/stop)
 * - Uses RAF to drive animation at screen refresh rate
 * - Calculates camera state in real-time for exact timestamp positioning
 * - Tracks bearing across frames for smooth damping
 * - Updates progress visualization in sync with camera
 */
export function AnimationControllerPreview({
  config,
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

  // Track bearing for followPath damping across frames
  const followPathBearingRef = useRef<number | undefined>(undefined);

  /**
   * Convert altitude to Mapbox zoom level.
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
   * Calculate camera state at a specific timestamp.
   * Real-time calculation based on animation phase and progress.
   */
  const calculateStateAtTimestamp = useCallback(
    (ts: number): CameraState | null => {
      let elapsed = 0;
      let phaseIndex = 0;

      // Find which phase we're in
      for (let i = 0; i < config.phases.length; i++) {
        const phase = config.phases[i]!;
        const phaseDuration = phase.duration;

        if (ts < elapsed + phaseDuration) {
          phaseIndex = i;
          break;
        }

        elapsed += phaseDuration;
      }

      const phase = config.phases[phaseIndex];
      if (!phase) {
        return null;
      }

      const phaseTimestamp = ts - elapsed;

      // Calculate state based on phase type
      if (phase.type === "flyTo") {
        const params = phase.params as import("./types").FlyToParams;
        return calculateFlyToState(phaseTimestamp, phase.duration, params);
      } else if (phase.type === "followPath") {
        const params = phase.params as import("./types").FollowPathParams;
        const result = calculateFollowPathState(
          phaseTimestamp,
          phase.duration,
          params,
          followPathBearingRef.current,
        );
        // Store bearing for next frame damping
        followPathBearingRef.current = result.nextBearing;
        return result;
      } else if (phase.type === "fitBounds") {
        // For fitBounds, get previous state as starting point
        const prevState = calculateStateAtTimestamp(elapsed - 1);
        if (!prevState) return null;
        const params = phase.params as FitBoundsParams;
        return calculateFitBoundsState(
          phaseTimestamp,
          phase.duration,
          params,
          prevState,
        );
      }

      return null;
    },
    [config],
  );

  /**
   * Apply camera state to Mapbox map.
   * Uses jumpTo for immediate positioning since we control timing externally.
   */
  const applyCameraState = useCallback(
    (state: CameraState) => {
      if (!map) return;

      // Use jumpTo for immediate positioning
      // RAF timing ensures smooth playback at screen refresh rate
      map.jumpTo({
        center: [state.lng, state.lat],
        zoom: altitudeToZoom(state.altitude, state.lat),
        bearing: state.bearing,
        pitch: state.pitch,
      });
    },
    [map, altitudeToZoom],
  );

  /**
   * Update progress visualization based on animation progress.
   * Calculates which part of the route has been "covered" by the animation.
   */
  const updateProgressVisualization = useCallback(
    (elapsed: number) => {
      if (!map) return;

      // Find followPath phase
      let phaseElapsed = 0;
      let followPathPhaseInfo: {
        duration: number;
        startTime: number;
      } | null = null;

      for (const phase of config.phases) {
        if (phase.type === "followPath") {
          followPathPhaseInfo = {
            startTime: phaseElapsed,
            duration: phase.duration,
          };
          break;
        }
        phaseElapsed += phase.duration;
      }

      if (!followPathPhaseInfo) return;

      // Calculate progress within followPath phase
      const followPathStart = followPathPhaseInfo.startTime;
      const followPathEnd = followPathStart + followPathPhaseInfo.duration;

      let routeProgress = 0;
      if (elapsed < followPathStart) {
        routeProgress = 0;
      } else if (elapsed >= followPathEnd) {
        routeProgress = 1;
      } else {
        routeProgress =
          (elapsed - followPathStart) / followPathPhaseInfo.duration;
      }

      // Get route data from followPath params
      const followPathPhase = config.phases.find(
        (p) => p.type === "followPath",
      );
      if (!followPathPhase) return;

      const params =
        followPathPhase.params as import("./types").FollowPathParams;
      const routeFeature = params.path;
      if (!routeFeature) return;

      const routeCoords = routeFeature.geometry.coordinates as [
        number,
        number,
      ][];
      if (routeCoords.length < 2) return;

      // Calculate cumulative distances
      const cumulativeDistances: number[] = [0];
      let accumulatedDistance = 0;

      for (let i = 1; i < routeCoords.length; i++) {
        const segment = lineString([routeCoords[i - 1]!, routeCoords[i]!]);
        const segmentDistance = length(segment);
        accumulatedDistance += segmentDistance;
        cumulativeDistances.push(accumulatedDistance);
      }

      const totalDistance = accumulatedDistance;
      const currentDistance = totalDistance * routeProgress;

      // Find which points are in the progress line
      const progressCoordinates: [number, number][] = [];
      for (let i = 0; i < cumulativeDistances.length; i++) {
        if (cumulativeDistances[i]! <= currentDistance) {
          progressCoordinates.push(routeCoords[i]!);
        } else {
          break;
        }
      }

      // Add interpolated point for exact progress
      if (progressCoordinates.length > 0 && routeProgress > 0) {
        const lastIndex = progressCoordinates.length - 1;
        if (lastIndex < routeCoords.length - 1) {
          const prevDist = cumulativeDistances[lastIndex]!;
          const nextDist = cumulativeDistances[lastIndex + 1]!;

          if (nextDist > prevDist && currentDistance > prevDist) {
            const segmentProgress =
              (currentDistance - prevDist) / (nextDist - prevDist);
            const prev = routeCoords[lastIndex]!;
            const next = routeCoords[lastIndex + 1]!;

            const interpolated: [number, number] = [
              prev[0] + (next[0] - prev[0]) * segmentProgress,
              prev[1] + (next[1] - prev[1]) * segmentProgress,
            ];
            progressCoordinates.push(interpolated);
          }
        }
      }

      // Get current position
      const currentPoint = along(routeFeature, currentDistance);
      const position = currentPoint.geometry.coordinates as [number, number];

      // Update progress route
      const progressSource = map.getSource("route-source-progress");
      if (
        progressSource &&
        progressSource.type === "geojson" &&
        progressCoordinates.length >= 1
      ) {
        progressSource.setData(lineString(progressCoordinates));
      }

      // Update position marker
      const positionSource = map.getSource("position-source");
      if (positionSource && positionSource.type === "geojson") {
        positionSource.setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: position,
          },
          properties: {},
        });
      }
    },
    [map, config],
  );

  /**
   * Reset animation to initial state.
   */
  const resetAnimation = useCallback(() => {
    if (!map) return;

    const initialState = calculateStateAtTimestamp(0);
    if (!initialState) return;

    map.jumpTo({
      center: [initialState.lng, initialState.lat],
      zoom: altitudeToZoom(initialState.altitude, initialState.lat),
      bearing: initialState.bearing,
      pitch: initialState.pitch,
    });

    // Reset progress to start
    updateProgressVisualization(0);
    updateAnimationPosition(0);
  }, [
    map,
    calculateStateAtTimestamp,
    altitudeToZoom,
    updateAnimationPosition,
    updateProgressVisualization,
  ]);

  /**
   * Main RAF animation loop for preview mode.
   */
  useEffect(() => {
    if (animationState === "stopped") {
      resetAnimation();
      return;
    }

    if (animationState !== "playing" && animationState !== "paused") {
      return;
    }

    if (!map) return;

    const totalDuration = config.phases.reduce((sum, p) => sum + p.duration, 0);

    let animationFrameId: number;
    let lastFrameTime: number | undefined;
    let isPaused = animationState === "paused";

    const animate = (currentTime: number) => {
      // Handle pause state
      if (animationState === "paused") {
        if (!isPaused) {
          isPaused = true;
        }
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Handle resume from pause
      if (isPaused && animationState === "playing") {
        isPaused = false;
        lastFrameTime = undefined;
      }

      // Initialize timing on first frame or after resume
      if (!lastFrameTime) {
        lastFrameTime = currentTime - animationPosition;
      }

      const elapsed = currentTime - lastFrameTime;

      if (elapsed < totalDuration) {
        // Calculate and apply camera state
        const state = calculateStateAtTimestamp(elapsed);
        if (state) {
          applyCameraState(state);
        }

        // Update progress visualization
        updateProgressVisualization(elapsed);

        // Update store
        updateAnimationPosition(elapsed);

        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete
        updateAnimationPosition(totalDuration);
        const finalState = calculateStateAtTimestamp(totalDuration - 1);
        if (finalState) {
          applyCameraState(finalState);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, animationState, animationPosition, config]);

  return null;
}
