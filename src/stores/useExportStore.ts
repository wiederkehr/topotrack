import { RefObject } from "react";
import { create } from "zustand";

import { assets, formats } from "@/features/composer/composer.settings";
import { toPng, toSvg } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import type { AssetType, FormatType } from "@/types";

interface ExportState {
  asset: AssetType;
  figureRef: RefObject<HTMLDivElement> | null;
  format: FormatType;
  handleExport: (activity: { name: string; start_date_local: string }) => void;
  setAsset: (value: string) => void;
  setFigureRef: (ref: RefObject<HTMLDivElement> | null) => void;
  setFormat: (value: string) => void;
}

export const useExportStore = create<ExportState>((set, get) => ({
  // Initial state
  format: formats[0]!,
  asset: assets[0]!,
  figureRef: null,

  // Actions
  setFormat: (value) => {
    const format = formats.find((format) => format.name === value);
    set({ format: format ?? formats[0]! });
  },

  setAsset: (value) => {
    const asset = assets.find((asset) => asset.name === value);
    set({ asset: asset || assets[0]! });
  },

  setFigureRef: (ref) => {
    set({ figureRef: ref });
  },

  handleExport: (activity) => {
    const { figureRef, format, asset } = get();
    if (!figureRef?.current || !activity) return;

    const name = formatFilename({
      date: activity.start_date_local,
      name: activity.name,
      format: format?.name || "Custom",
      type: asset?.type || "png",
    });

    switch (asset?.type) {
      case "png":
        void toPng({ node: figureRef.current, name, format });
        break;
      case "svg":
        void toSvg({ node: figureRef.current, name, format });
        break;
      // case "webm":
      //   void toWebM({ node: figureRef.current, name, format });
      //   break;
      default:
        break;
    }
  },
}));
