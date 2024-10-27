import download from "downloadjs";
import { toPng as htmlToPng } from "html-to-image";

import type { FormatType } from "@/types";

type ToPngProps = {
  format?: FormatType;
  name: string;
  node: HTMLElement;
};

async function toPng({ node, name, format }: ToPngProps): Promise<void> {
  await Promise.resolve();
  const data = await htmlToPng(node, {
    pixelRatio: 2,
    canvasWidth: format?.width,
    canvasHeight: format?.height,
  });
  if (typeof data === "string") {
    download(data, name, "image/png");
  } else {
    console.error("Failed to generate PNG data.");
  }
}

export { toPng };
