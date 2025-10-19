import { Button } from "@radix-ui/themes";
import { RotateCw } from "lucide-react";

import { useTemplateStore } from "@/stores";

export function Replay() {
  const triggerReplay = useTemplateStore((state) => state.triggerReplay);

  return (
    <Button variant="outline" onClick={triggerReplay}>
      <RotateCw size={16} />
      Replay
    </Button>
  );
}
