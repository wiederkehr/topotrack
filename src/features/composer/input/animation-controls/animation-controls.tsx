import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";

import { Button } from "@/components/interface/button";
import { Module, Submodule } from "@/components/interface/module";
import { useTemplateStore } from "@/stores";

export function AnimationControls() {
  const animationState = useTemplateStore((state) => state.animationState);
  const playAnimation = useTemplateStore((state) => state.playAnimation);
  const pauseAnimation = useTemplateStore((state) => state.pauseAnimation);
  const replayAnimation = useTemplateStore((state) => state.replayAnimation);
  const resetAnimation = useTemplateStore((state) => state.resetAnimation);

  const isPlaying = animationState === "playing";
  const isStopped = animationState === "stopped";

  return (
    <Module label="Animation">
      <Submodule>
        {/* Play/Pause button */}
        {isPlaying ? (
          <Button onClick={pauseAnimation}>
            <Pause size={16} />
            Pause
          </Button>
        ) : (
          <Button onClick={playAnimation} disabled={isStopped}>
            <Play size={16} />
            Play
          </Button>
        )}
      </Submodule>
      <Submodule>
        {/* Replay button */}
        <Button onClick={replayAnimation}>
          <RotateCw size={16} />
          Replay
        </Button>
      </Submodule>
      <Submodule>
        {/* Reset button */}
        <Button onClick={resetAnimation} disabled={isStopped}>
          <RotateCcw size={16} />
          Reset
        </Button>
      </Submodule>
    </Module>
  );
}
