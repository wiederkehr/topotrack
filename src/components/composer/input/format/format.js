import Module, { Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";
import Dimensionfields from "./dimensionfields";
import styles from "./format.module.css";

export default function Format({ format, formats, onFormatChange }) {
  return (
    <Module label="Format">
      <div className={styles.format}>
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
      </div>
    </Module>
  );
}
