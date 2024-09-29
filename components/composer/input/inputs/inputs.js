import Module, { Submodule } from "@/components/interface/module";
import Label from "@/components/interface/label";
import Select from "@/components/interface/select";

export default function Inputs({ inputs, variables, onVariableChange }) {
  return (
    <Module label="Variables">
      {inputs.map((input, index) => (
        <Submodule key={index}>
          <Label>{input.name}</Label>
          <Select
            value={variables[input.name]}
            onValueChange={(value) => {
              onVariableChange({ name: input.name, value: value });
            }}
            options={input.options}
          />
        </Submodule>
      ))}
    </Module>
  );
}
