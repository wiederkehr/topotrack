import download from "downloadjs";

import type { FormatType } from "@/types";

import { recordNodeAsBlob } from "./recordNodeAsBlob";

type ToWebMProps = {
  format?: FormatType;
  name: string;
  node: HTMLElement;
};

async function toWebM({ node, name, format }: ToWebMProps): Promise<void> {
  await Promise.resolve();
  const blob = await recordNodeAsBlob({
    node,
    format,
    duration: 6000,
    fps: 30,
  });
  if (blob instanceof Blob) {
    download(blob, name, "video/webm");
  } else {
    console.error("Failed to generate WebM data.");
  }
}

export { toWebM };
