import type { Map as MapboxGLMap } from "mapbox-gl";
import { useEffect, useRef } from "react";

import type {
  AnimationPhase,
  AnimationSequence,
} from "@/features/visuals/map/animations";
import { AnimationController } from "@/features/visuals/map/animations";
import { useTemplateStore } from "@/stores";

/**
 * Hook for managing map animations with full lifecycle control
 * Watches animation state from the store and orchestrates play/stop/error recovery
 *
 * @param map - Mapbox GL map instance
 * @param animationConfig - The animation configuration to execute
 * @param initialCameraState - Camera position to reset to when animation stops
 */
export function useAnimationController(
  map: MapboxGLMap | null,
  animationConfig: AnimationSequence | AnimationPhase | null,
  initialCameraState: {
    bearing: number;
    center: [number, number];
    pitch: number;
  },
) {
  const controllerRef = useRef<AnimationController | null>(null);
  const animationState = useTemplateStore((state) => state.animationState);

  // Initialize controller when map becomes available
  useEffect(() => {
    if (!map) {
      controllerRef.current = null;
      return;
    }

    if (!controllerRef.current) {
      controllerRef.current = new AnimationController(map);
    }
  }, [map]);

  // Watch animation state and execute accordingly
  useEffect(() => {
    if (!controllerRef.current || !animationConfig) {
      return;
    }

    const executeAnimation = async () => {
      const controller = controllerRef.current;
      if (!controller) return;

      try {
        console.log("[useAnimationController] Starting animation execution");
        await controller.play(animationConfig, (elapsedTime: number) => {
          console.log(
            `[useAnimationController] Animation progress: ${elapsedTime}ms`,
          );
        });

        console.log("[useAnimationController] Animation completed naturally");
        // Reset state after animation completes
        useTemplateStore.setState({ animationState: "stopped" });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("[useAnimationController] Animation was aborted");
          // Reset camera to initial state
          if (map) {
            map.easeTo({
              center: initialCameraState.center,
              bearing: initialCameraState.bearing,
              pitch: initialCameraState.pitch,
              duration: 0,
            });
          }
          return;
        }

        console.error("[useAnimationController] Animation error:", error);
        // Set state to stopped on error
        useTemplateStore.setState({ animationState: "stopped" });
      }
    };

    if (animationState === "playing") {
      void executeAnimation();
    } else if (animationState === "stopped") {
      // Stop any running animation
      controllerRef.current?.stop();
    }
  }, [animationState, animationConfig, map, initialCameraState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.stop();
    };
  }, []);
}
