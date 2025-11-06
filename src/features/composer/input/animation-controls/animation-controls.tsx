import { Pause, Play, Square } from "lucide-react";

import { Button } from "@/components/interface/button";
import { Module, Submodule } from "@/components/interface/module";
import { useTemplateStore } from "@/stores";

export function AnimationControls() {
  const animationState = useTemplateStore((state) => state.animationState);
  const playAnimation = useTemplateStore((state) => state.playAnimation);
  const pauseAnimation = useTemplateStore((state) => state.pauseAnimation);
  const resetAnimation = useTemplateStore((state) => state.resetAnimation);

  const isPlaying = animationState === "playing";
  const isStopped = animationState === "stopped";

  return (
    <Module label="Animation">
      <Submodule>
        {/* Play button - plays from current position */}
        <Button onClick={playAnimation} disabled={isPlaying}>
          <Play size={16} />
          Play
        </Button>
      </Submodule>
      <Submodule>
        {/* Pause button - pauses at current position */}
        <Button onClick={pauseAnimation} disabled={!isPlaying}>
          <Pause size={16} />
          Pause
        </Button>
      </Submodule>
      <Submodule>
        {/* Stop button - stops and resets to start */}
        <Button onClick={resetAnimation} disabled={isStopped}>
          <Square size={16} />
          Stop
        </Button>
      </Submodule>
    </Module>
  );
}
