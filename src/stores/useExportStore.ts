import { RefObject } from "react";
import { create } from "zustand";

import { assets, formats } from "@/features/composer/composer.settings";
import { type ExportFormat, exportNode } from "@/functions/export";
import { formatFilename } from "@/functions/format";
import { useTemplateStore } from "@/stores/useTemplateStore";
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
  exportTimestamp: -1, // Initialize to -1 so first frame (0) triggers a change
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

    // Stop and reset animation before export (for MP4 exports)
    if (asset.type === "mp4") {
      useTemplateStore.getState().resetAnimation();

      // Wait for map to reset to initial state before starting export
      // This ensures the export captures from the beginning
      setTimeout(() => {
        const node = figureRef.current;
        if (!node) return;

        set({ isExporting: true, exportProgress: 0 });

        void exportNode({
          node,
          name,
          format,
          type: asset.type as ExportFormat,
        }).finally(() => {
          set({ isExporting: false, exportProgress: 0 });
        });
      }, 200);
    } else {
      // For non-animated exports (PNG), proceed immediately
      set({ isExporting: true, exportProgress: 0 });

      void exportNode({
        node: figureRef.current,
        name,
        format,
        type: asset.type as ExportFormat,
      }).finally(() => {
        set({ isExporting: false, exportProgress: 0 });
      });
    }
  },
}));
