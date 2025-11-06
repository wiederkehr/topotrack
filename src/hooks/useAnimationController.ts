import type { Map as MapboxGLMap } from "mapbox-gl";
import { useCallback, useRef } from "react";

import type {
  AnimationPhase,
  AnimationSequence,
} from "@/features/visuals/map/animations";
import { AnimationController } from "@/features/visuals/map/animations";

/**
 * Hook for managing map animations with play/stop controls
 * Handles animation lifecycle and cleanup
 */
export function useAnimationController(map: MapboxGLMap | null) {
  const controllerRef = useRef<AnimationController | null>(null);

  // Initialize controller on first use
  const initializeController = useCallback(() => {
    if (!map || controllerRef.current) {
      return controllerRef.current;
    }

    controllerRef.current = new AnimationController(map);
    return controllerRef.current;
  }, [map]);

  // Play animation
  const play = useCallback(
    async (
      animation: AnimationSequence | AnimationPhase,
      onProgress?: (elapsedTime: number) => void,
    ) => {
      const controller = initializeController();
      if (!controller) {
        console.error("[useAnimationController] Map not available");
        return;
      }

      // Re-throw all errors, including abort errors, so calling code can handle them
      await controller.play(animation, onProgress);
    },
    [initializeController],
  );

  // Stop animation
  const stop = useCallback(() => {
    const controller = controllerRef.current;
    if (controller && controller.isRunning()) {
      controller.stop();
    }
  }, []);

  // Get current playing status
  const isRunning = useCallback(() => {
    return controllerRef.current?.isRunning() ?? false;
  }, []);

  return {
    play,
    stop,
    isRunning,
  };
}
