import { Button } from "@radix-ui/themes";
import { RotateCw } from "lucide-react";

import { useTemplateStore } from "@/stores";

export function Replay() {
  const { template, triggerReplay } = useTemplateStore();

  if (!template.isAnimated) {
    return null;
  }

  return (
    <Button size="3" variant="surface" onClick={triggerReplay}>
      <RotateCw size={16} />
      Replay
    </Button>
  );
}
