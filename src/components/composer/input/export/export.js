import Button from "@/components/composer/interface/button";
import Module, { Submodule } from "@/components/composer/interface/module";
import Select from "@/components/composer/interface/select";
import styles from "./export.module.css";

export default function Export({
  asset,
  assets,
  onAssetChange,
  onAssetExport,
}) {
  return (
    <Module label="Export">
      <div className={styles.export}>
        <Submodule>
          <Select
            value={asset.name}
            onValueChange={onAssetChange}
            options={assets.map(({ name }) => name)}
          />
        </Submodule>
        <Submodule>
          <Button onClick={onAssetExport}>Download</Button>
        </Submodule>
      </div>
    </Module>
  );
}
