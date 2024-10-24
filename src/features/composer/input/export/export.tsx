import Button from "@/components/interface/button";
import { Module, Submodule } from "@/components/interface/module";
import Select from "@/components/interface/select";

type Asset = {
  name: string;
};

type ExportProps = {
  asset: Asset;
  assets: Asset[];
  onAssetChange: (value: string) => void;
  onAssetExport: () => void;
};

function Export({ asset, assets, onAssetChange, onAssetExport }: ExportProps) {
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

export default Export;
export type { Asset, ExportProps };