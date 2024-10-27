import download from "downloadjs";
import { toSvg as htmlToSvg } from "html-to-image";

import type { FormatType } from "@/types";

type ToSvgProps = {
  format?: FormatType;
  name: string;
  node: HTMLElement;
};

async function toSvg({ node, name, format }: ToSvgProps): Promise<void> {
  await Promise.resolve();
  const data = await htmlToSvg(node, {
    canvasWidth: format?.width,
    canvasHeight: format?.height,
  });
  if (typeof data === "string") {
    download(data, name, "image/svg+xml");
  } else {
    console.error("Failed to generate SVG data.");
  }
}

export { toSvg };
