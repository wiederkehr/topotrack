import Module, { Submodule } from "@/components/interface/module";
import Label from "@/components/interface/label";
import Select from "@/components/interface/select";
import styles from "./variables.module.css";

export default function Variables({ variables, onVariableChange }) {
  return (
    <Module label="Variables">
      {variables.map((variable, index) => (
        <Submodule key={index}>
          <Label>{variable.name}</Label>
          <Select
            value={variable.value}
            onValueChange={(value) => {
              onVariableChange({ name: variable.name, value: value });
            }}
            options={variable.options}
          />
        </Submodule>
      ))}
    </Module>
  );
}
