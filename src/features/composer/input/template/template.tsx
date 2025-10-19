import { Button } from "@radix-ui/themes";
import { RotateCw } from "lucide-react";

import { Module, Submodule } from "@/components/interface/module";
import { Select } from "@/components/interface/select";
import { useTemplateStore } from "@/stores";

type TemplateProps = {
  onTemplateChange: (value: string) => void;
  template: {
    isAnimated?: boolean;
    name: string;
  };
  templates: {
    name: string;
  }[];
};

export function Template({
  template,
  templates,
  onTemplateChange,
}: TemplateProps) {
  const triggerReplay = useTemplateStore((state) => state.triggerReplay);
  return (
    <Module label="Template">
      <Submodule>
        <Select
          value={template.name}
          onValueChange={onTemplateChange}
          options={templates.map(({ name }) => name)}
        />
      </Submodule>
      {template.isAnimated && (
        <Submodule>
          <Button variant="outline" onClick={triggerReplay}>
            <RotateCw size={16} />
            Replay
          </Button>
        </Submodule>
      )}
    </Module>
  );
}
export type { TemplateProps };
