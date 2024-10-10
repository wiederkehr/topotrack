import Button from "@/components/interface/button";
import Module, { Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";

export default function Export({
  asset,
  assets,
  onAssetChange,
  onAssetExport,
}) {
  return (
    <Module label="Export">
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
    </Module>
  );
}
