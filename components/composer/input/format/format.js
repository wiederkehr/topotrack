import Module, { Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";
import Dimensionfields from "./dimensionfields";

export default function Format({ format, formats, onFormatChange }) {
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
