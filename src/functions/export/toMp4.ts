import download from "downloadjs";

import type { FormatType } from "@/types";

type ToMp4Props = {
  blob: Blob;
  format?: FormatType;
  name: string;
};

async function toMp4({ blob, name, format }: ToMp4Props): Promise<void> {
  await Promise.resolve();
  if (blob instanceof Blob) {
    download(blob, name, "video/mp4");
  } else {
    console.error("Failed to generate MP4 data.");
  }
}

export { toMp4 };
