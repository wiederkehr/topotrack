import Module from "@/components/interface/module";
import Select from "@/components/interface/select";
import styles from "./template.module.css";

export default function Template({ template, templates, onTemplateChange }) {
  return (
    <Module label="Template">
      <div className={styles.template}>
        <Select
          value={template.name}
          onValueChange={onTemplateChange}
          options={templates.map(({ name }) => name)}
        />
      </div>
    </Module>
  );
}
