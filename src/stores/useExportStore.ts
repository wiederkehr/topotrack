import { RefObject } from "react";
import { create } from "zustand";

import { assets, formats } from "@/features/composer/composer.settings";
import { type ExportFormat, exportNode } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import type { AssetType, FormatType } from "@/types";

interface ExportState {
  animationDuration: number | null;
  asset: AssetType;
  exportMode: boolean;
  exportProgress: number;
  exportTimestamp: number;
  figureRef: RefObject<HTMLDivElement> | null;
  format: FormatType;
  frameReadyCallback: (() => void) | null;
  handleExport: (activity: { name: string; start_date_local: string }) => void;
  isExporting: boolean;
  setAnimationDuration: (duration: number | null) => void;
  setAsset: (value: string) => void;
  setExportMode: (mode: boolean) => void;
  setExportProgress: (progress: number) => void;
  setExportTimestamp: (timestamp: number) => void;
  setFigureRef: (ref: RefObject<HTMLDivElement> | null) => void;
  setFormat: (value: string) => void;
  setFrameReadyCallback: (callback: (() => void) | null) => void;
  setIsExporting: (isExporting: boolean) => void;
}

export const useExportStore = create<ExportState>((set, get) => ({
  // Initial state
  format: formats[0]!,
  asset: assets[0]!,
  figureRef: null,
  exportMode: false,
  exportTimestamp: 0,
  frameReadyCallback: null,
  animationDuration: null,
  isExporting: false,
  exportProgress: 0,

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

  setExportMode: (mode) => {
    set({ exportMode: mode });
  },

  setExportTimestamp: (timestamp) => {
    set({ exportTimestamp: timestamp });
  },

  setFrameReadyCallback: (callback) => {
    set({ frameReadyCallback: callback });
  },

  setAnimationDuration: (duration) => {
    set({ animationDuration: duration });
  },

  setIsExporting: (isExporting) => {
    set({ isExporting });
  },

  setExportProgress: (progress) => {
    set({ exportProgress: progress });
  },

  handleExport: (activity) => {
    const { figureRef, format, asset } = get();
    if (!figureRef?.current || !activity || !asset?.type) return;

    const name = formatFilename({
      date: activity.start_date_local,
      name: activity.name,
      format: format?.name || "Custom",
      type: asset.type,
    });

    set({ isExporting: true, exportProgress: 0 });

    void exportNode({
      node: figureRef.current,
      name,
      format,
      type: asset.type as ExportFormat,
    }).finally(() => {
      set({ isExporting: false, exportProgress: 0 });
    });
  },
}));
