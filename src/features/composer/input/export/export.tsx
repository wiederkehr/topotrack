import { Callout, Progress, Text } from "@radix-ui/themes";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/interface/button";
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
  const [mp4Supported, setMp4Supported] = useState(true);
  const isExporting = useExportStore((state) => state.isExporting);
  const exportProgress = useExportStore((state) => state.exportProgress);

  useEffect(() => {
    setMp4Supported(checkMp4Support());
  }, []);

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
          <Callout.Root color="orange" size="1">
            <Callout.Icon>
              <InfoIcon size={16} />
            </Callout.Icon>
            <Callout.Text size="1">
              MP4 export requires Chrome 126+ or equivalent
            </Callout.Text>
          </Callout.Root>
        </Submodule>
      )}

      <Submodule>
        <Button onClick={onAssetExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Download"}
        </Button>
      </Submodule>

      {showProgress && (
        <Submodule>
          <Progress value={exportProgress} size="1" />
          <Text size="1" color="gray">
            {exportProgress}%
            {estimatedTimeRemaining > 0 &&
              ` • ~${estimatedTimeRemaining}s remaining`}
          </Text>
        </Submodule>
      )}
    </Module>
  );
}
