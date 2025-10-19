import { Module, Submodule } from "@/components/interface/module";
import { Select } from "@/components/interface/select";

import { Replay } from "../replay";

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
          <Replay />
        </Submodule>
      )}
    </Module>
  );
}
export type { TemplateProps };
