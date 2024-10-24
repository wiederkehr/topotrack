import { Module } from "@/components/interface/module";
import Select from "@/components/interface/select";

type TemplateProps = {
  onTemplateChange: (value: string) => void;
  template: {
    name: string;
  };
  templates: {
    name: string;
  }[];
};

function Template({ template, templates, onTemplateChange }: TemplateProps) {
  return (
    <Module label="Template">
      <Select
        value={template.name}
        onValueChange={onTemplateChange}
        options={templates.map(({ name }) => name)}
      />
    </Module>
  );
}

export default Template;
export type { TemplateProps };
