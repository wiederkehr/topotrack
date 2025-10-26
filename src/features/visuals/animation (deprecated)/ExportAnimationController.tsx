/**
 * Export Animation Controller
 *
 * Handles frame-by-frame animation rendering for MP4 export.
 * Uses the SAME pre-calculated keyframes as preview mode, ensuring
 * perfect sync between preview and exported video.
 *
 * Key design: Coordinate with export system via store subscription.
 * When exportTimestamp changes, render that frame and signal ready.
 */

import { lineString } from "@turf/turf";
import type { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef } from "react";

import { useExportStore } from "@/stores";

import {
  interpolateCameraKeyframes,
  interpolateProgressKeypoints,
  type PreCalculatedAnimation,
} from "./preCalculator";
import type { FitBoundsParams } from "./types";

type ExportAnimationControllerProps = {
  map: MapboxMap | null;
  preCalculated: PreCalculatedAnimation;
};

/**
 * Export animation controller - handles frame-by-frame rendering.
 * Subscribes to export store for frame progression.
 * Uses identical keyframe data as preview for zero drift.
 */
export function ExportAnimationController({
  preCalculated,
  map,
}: ExportAnimationControllerProps) {
  // Track if we're currently waiting for a map render
  const isWaitingForRender = useRef(false);

  /**
   * Convert altitude to Mapbox zoom level.
   */
  const altitudeToZoom = (altitude: number, latitude: number): number => {
    const metersPerPixel =
      (altitude * Math.cos((latitude * Math.PI) / 180)) / 256;
    const zoom = Math.log2(40075016.686 / metersPerPixel) - 8;
    return Math.max(0, Math.min(20, zoom));
  };

  /**
   * Apply camera state to map for export frame capture.
   */
  const applyCameraStateForExport = (
    state: ReturnType<typeof interpolateCameraKeyframes>,
  ) => {
    if (!map) return;

    // Use jumpTo for immediate positioning (no animation)
    // since we control timing externally
    map.jumpTo({
      center: [state.lng, state.lat],
      zoom: altitudeToZoom(state.altitude, state.lat),
      bearing: state.bearing,
      pitch: state.pitch,
    });
  };

  /**
   * Update progress visualization for export frame.
   */
  const updateProgressVisualizationForExport = (
    progress: ReturnType<typeof interpolateProgressKeypoints>,
  ) => {
    if (!map) return;

    // Update progress route
    const progressSource = map.getSource("route-source-progress");
    if (progressSource && progressSource.type === "geojson") {
      progressSource.setData(lineString(progress.routeCoordinates));
    }

    // Update position marker
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
  };

  /**
   * Wait for map to finish rendering before signaling frame ready.
   * Polls isMoving() and waits for idle event.
   */
  const waitForMapRender = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!map) {
        resolve();
        return;
      }

      // Check if map is already idle
      if (!map.isMoving() && !map.isZooming()) {
        resolve();
        return;
      }

      // Wait for idle event
      const onIdle = () => {
        map.off("idle", onIdle);
        resolve();
      };

      map.once("idle", onIdle);
    });
  };

  /**
   * Main effect: Subscribe to export store for frame-by-frame rendering.
   */
  useEffect(() => {
    const unsubscribe = useExportStore.subscribe((state, prevState) => {
      // Only act when in export mode and timestamp changes
      if (
        !state.exportMode ||
        state.exportTimestamp === prevState.exportTimestamp
      ) {
        return;
      }

      if (!map || isWaitingForRender.current) {
        return;
      }

      const timestamp = state.exportTimestamp;

      // Determine which phase we're in
      let phaseElapsed = 0;

      for (const phase of preCalculated.config.phases) {
        if (timestamp < phaseElapsed + phase.duration) {
          const phaseTimestamp = timestamp - phaseElapsed;

          if (phase.type === "followPath") {
            // Interpolate camera from keyframes
            const cameraState = interpolateCameraKeyframes(
              preCalculated.cameraKeyframes,
              phaseTimestamp,
            );
            applyCameraStateForExport(cameraState);

            // Update progress visualization
            const progress = interpolateProgressKeypoints(
              preCalculated.progressKeypoints,
              phaseTimestamp,
            );
            updateProgressVisualizationForExport(progress);
          } else if (phase.type === "fitBounds") {
            // For fitBounds, call native method once at start
            if (phaseTimestamp < 16) {
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
            // Let Mapbox handle the animation
          }

          break;
        }

        phaseElapsed += phase.duration;
      }

      // Mark that we're waiting for render, then wait and notify
      isWaitingForRender.current = true;

      void waitForMapRender().then(() => {
        isWaitingForRender.current = false;

        // Get latest callback from store (may have changed)
        const callback = useExportStore.getState().frameReadyCallback;
        callback?.();
      });
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, preCalculated]);

  return null;
}
