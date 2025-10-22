import { Module, Submodule } from "@/components/interface/module";
import { Select } from "@/components/interface/select";

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
    </Module>
  );
}
export type { TemplateProps };
