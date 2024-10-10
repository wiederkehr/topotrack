import Color from "@/components/interface/color";
import Label from "@/components/interface/label";
import Module, { Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";

export default function Inputs({ inputs, variables, onVariableChange }) {
  return (
    <Module label="Variables">
      {inputs.map((input, index) => {
        let component = null;
        switch (input.type) {
          case "select":
            component = (
              <Select
                value={variables[input.name]}
                onValueChange={(value) => {
                  onVariableChange({ name: input.name, value: value });
                }}
                options={input.options}
              />
            );
            break;
          case "color":
            component = (
              <Color
                value={variables[input.name]}
                onValueChange={(value) => {
                  onVariableChange({ name: input.name, value: value });
                }}
              />
            );
            break;

          default:
            break;
        }
        return (
          <Submodule key={index}>
            <Label>{input.name}</Label>
            {component}
          </Submodule>
        );
      })}
    </Module>
  );
}
