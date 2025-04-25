import Color from "@/components/interface/color";
import Label from "@/components/interface/label";
import { Module, Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";
import { VariableType } from "@/types";

type ControlsProps = {
  onVariableChange: (variable: { name: string; value: string }) => void;
  variables: VariableType[];
};

function Controls({ variables, onVariableChange }: ControlsProps) {
  return (
    <Module label="Variables">
      {variables.map((variable, index) => {
        let control;
        switch (variable.type) {
          case "select":
            control = (
              <Select
                value={variable.value ?? ""}
                onValueChange={(value) => {
                  onVariableChange({ name: variable.name, value: value });
                }}
                options={variable.options || []}
              />
            );
            break;
          case "color":
            control = (
              <Color
                value={variable.value ?? ""}
                onValueChange={(value) => {
                  onVariableChange({ name: variable.name, value: value });
                }}
              />
            );
            break;

          default:
            break;
        }
        return (
          <Submodule key={index}>
            <Label>{variable.label}</Label>
            {control}
          </Submodule>
        );
      })}
    </Module>
  );
}

export default Controls;
