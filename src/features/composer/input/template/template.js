import Module from "@/components/interface/module";
import Select from "@/components/interface/select";

export default function Template({ template, templates, onTemplateChange }) {
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
