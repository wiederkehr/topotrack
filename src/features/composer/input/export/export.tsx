import { useMemo } from "react";

import { Button } from "@/components/interface/button";
import { Callout } from "@/components/interface/callout";
import { Module, Submodule } from "@/components/interface/module";
import { Select } from "@/components/interface/select";
import { checkMp4Support } from "@/functions/export";
import { useExportStore } from "@/stores";
import { AssetType } from "@/types";

type ExportProps = {
  asset: AssetType;
  assets: AssetType[];
  onAssetChange: (value: string) => void;
  onAssetExport: () => void;
};

export function Export({
  asset,
  assets,
  onAssetChange,
  onAssetExport,
}: ExportProps) {
  const isExporting = useExportStore((state) => state.isExporting);
  const exportProgress = useExportStore((state) => state.exportProgress);

  // Check MP4 support once and memoize
  const mp4Supported = useMemo(() => checkMp4Support(), []);

  const showMp4Warning = asset.type === "mp4" && !mp4Supported;
  const showProgress = isExporting && asset.type === "mp4";

  // Calculate estimated time remaining (assumes ~30fps)
  const estimatedTimeRemaining =
    showProgress && exportProgress < 100
      ? Math.ceil(((100 - exportProgress) / 100) * 10) // ~10s average
      : 0;

  return (
    <Module label="Export">
      <Submodule>
        <Select
          value={asset.name}
          onValueChange={onAssetChange}
          options={assets.map(({ name }) => name)}
        />
      </Submodule>

      {showMp4Warning && (
        <Submodule>
          <Callout>MP4 export requires Chrome 126+ or equivalent</Callout>
        </Submodule>
      )}

      <Submodule>
        <Button onClick={onAssetExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Download"}
        </Button>
      </Submodule>

      {showProgress && (
        <Submodule>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Exporting: {exportProgress}%
            {estimatedTimeRemaining > 0 &&
              ` • ~${estimatedTimeRemaining}s remaining`}
          </div>
        </Submodule>
      )}
    </Module>
  );
}
