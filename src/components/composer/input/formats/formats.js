import Module, { Submodule } from "@/components/composer/interface/module";
import Select from "@/components/composer/interface/select";
import Dimensionfields from "./dimensionfields";
import styles from "./formats.module.css";

export default function Formats({ format, formats, onFormatChange }) {
  return (
    <Module label="Format">
      <div className={styles.formats}>
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
