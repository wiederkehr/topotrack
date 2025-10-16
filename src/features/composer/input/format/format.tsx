import { Module, Submodule } from "@/components/interface/module";
import { Select } from "@/components/interface/select";

import { Dimensionfields } from "./dimensionfields";

type FormatProps = {
  format: { height: number; name: string; width: number };
  formats: { name: string }[];
  onFormatChange: (value: string) => void;
};

export function Format({ format, formats, onFormatChange }: FormatProps) {
  return (
    <Module label="Format">
      <Submodule>
        <Select
          value={format.name}
          onValueChange={onFormatChange}
          options={formats.map(({ name }) => name)}
        />
      </Submodule>
      <Submodule>
        <Dimensionfields width={format.width} height={format.height} />
      </Submodule>
    </Module>
  );
}
