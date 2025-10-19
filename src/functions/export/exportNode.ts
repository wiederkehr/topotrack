import download from "downloadjs";
import { toPng as htmlToPng, toSvg as htmlToSvg } from "html-to-image";

import type { FormatType } from "@/types";

import { recordNodeAsBlob } from "./recordNodeAsBlob";
import { recordNodeAsMp4 } from "./recordNodeAsMp4";

// Shared types for all export operations
export type ExportFormat = "png" | "svg" | "webm" | "mp4";

export type ExportOptions = {
  format?: FormatType;
  name: string;
  node: HTMLElement;
  type: ExportFormat;
};

type ExportConfig = {
  generate: (
    node: HTMLElement,
    options: ExportGenerateOptions,
  ) => Promise<string | Blob | null>;
  mimeType: string;
};

type ExportGenerateOptions = {
  canvasHeight: number;
  canvasWidth: number;
  pixelRatio?: number;
};

// Export format configurations
const exportConfigs: Record<ExportFormat, ExportConfig> = {
  png: {
    generate: async (node, options) =>
      htmlToPng(node, {
        ...options,
        pixelRatio: options.pixelRatio ?? 2,
      }),
    mimeType: "image/png",
  },
  svg: {
    generate: async (node, options) => htmlToSvg(node, options),
    mimeType: "image/svg+xml",
  },
  webm: {
    generate: async (node, options) =>
      recordNodeAsBlob({
        node,
        format: {
          name: "Custom",
          width: options.canvasWidth,
          height: options.canvasHeight,
        },
        duration: 6000,
        fps: 30,
      }),
    mimeType: "video/webm",
  },
  mp4: {
    generate: async (node, options) =>
      recordNodeAsMp4({
        node,
        format: {
          name: "Custom",
          width: options.canvasWidth,
          height: options.canvasHeight,
        },
        duration: 10000, // 10 seconds to match full animation
        fps: 30,
      }),
    mimeType: "video/mp4",
  },
};

/**
 * Unified export function that handles multiple output formats
 * Consolidates toPng, toSvg, and toWebM into a single API
 */
export async function exportNode({
  node,
  name,
  format,
  type,
}: ExportOptions): Promise<void> {
  const config = exportConfigs[type];
  if (!config) {
    console.error(`Unsupported export type: ${type}`);
    return;
  }

  try {
    const canvasWidth = format?.width ?? node.offsetWidth;
    const canvasHeight = format?.height ?? node.offsetHeight;

    const data = await config.generate(node, { canvasWidth, canvasHeight });

    if (data) {
      download(data, name, config.mimeType);
    } else {
      console.error(`Failed to generate ${type.toUpperCase()} data.`);
    }
  } catch (error) {
    console.error(`Error exporting ${type.toUpperCase()}:`, error);
  }
}
