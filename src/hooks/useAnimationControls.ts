import { useCallback } from "react";

import { useTemplateStore } from "@/stores";

/**
 * Hook to get animation control callbacks that work across components
 * The template Visual component sets these callbacks, and UI components call them
 */
export function useAnimationControls() {
  const playAnimation = useTemplateStore((state) => state.playAnimation);
  const resetAnimation = useTemplateStore((state) => state.resetAnimation);

  const play = useCallback(() => {
    playAnimation();
  }, [playAnimation]);

  const stop = useCallback(() => {
    resetAnimation();
  }, [resetAnimation]);

  return { play, stop };
}
