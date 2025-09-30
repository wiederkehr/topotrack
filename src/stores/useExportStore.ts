import { create } from "zustand";
import { RefObject } from "react";
import type { AssetType, FormatType } from "@/types";
import { assets, formats } from "@/features/composer/composer.settings";
import { toPng, toSvg, toWebM } from "@/functions/export";
import { formatFilename } from "@/functions/format";

interface ExportState {
  // State
  format: FormatType;
  asset: AssetType;
  figureRef: RefObject<HTMLDivElement> | null;

  // Actions
  setFormat: (value: string) => void;
  setAsset: (value: string) => void;
  setFigureRef: (ref: RefObject<HTMLDivElement> | null) => void;
  handleExport: (activity: {
    start_date_local: string;
    name: string;
  }) => void;
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