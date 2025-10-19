import html2canvas from "html2canvas-pro";

import type { FormatType } from "@/types";

type RecordNodeAsBlobProps = {
  duration?: number;
  format?: FormatType;
  fps?: number;
  node: HTMLElement;
};

// FIXME: There’s an issue with parsing.

export async function recordNodeAsBlob({
  node,
  format,
  duration = 6000,
  fps = 30,
}: RecordNodeAsBlobProps): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  const ctx = canvas.getContext("2d")!;
  const chunks: BlobPart[] = [];

  const width = format?.width ?? node.offsetWidth;
  const height = format?.height ?? node.offsetHeight;

  canvas.width = width;
  canvas.height = height;

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const totalFrames = Math.floor((duration / 1000) * fps);
  let frame = 0;

  recorder.start();

  async function renderFrame() {
    const bitmap = await html2canvas(node, { width, height });
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0);

    frame++;
    if (frame < totalFrames) {
      setTimeout(() => {
        void renderFrame();
      }, 1000 / fps);
    } else {
      recorder.stop();
    }
  }

  return new Promise<Blob | null>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      resolve(blob);
    };

    void renderFrame();
  });
}
