import html2canvas from "html2canvas-pro";

import type { FormatType } from "@/types";

type RecordNodeAsMp4Props = {
  duration?: number;
  format?: FormatType;
  fps?: number;
  node: HTMLElement;
  onProgress?: (progress: number) => void;
};

/**
 * Records an HTML node as an MP4 video using native browser MediaRecorder API.
 * Requires Chrome 126+ (June 2024) or equivalent browser with MP4 support.
 *
 * Uses the same approach as recordNodeAsBlob (WebM) but with MP4 mimetype.
 *
 * @param props - Recording configuration
 * @returns Promise that resolves to a Blob containing the MP4 video
 *
 * @example
 * ```ts
 * const blob = await recordNodeAsMp4({
 *   node: document.getElementById('animation'),
 *   format: { width: 1080, height: 1080, name: 'Square' },
 *   duration: 10000,
 *   fps: 30,
 *   onProgress: (progress) => console.log(`${progress}% complete`),
 * });
 * ```
 */
export async function recordNodeAsMp4({
  node,
  format,
  duration = 10000, // 10 seconds to match full animation duration
  fps = 30,
  onProgress,
}: RecordNodeAsMp4Props): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const stream = canvas.captureStream(fps);

  // Try MP4 with different codec combinations for best compatibility
  const mimeTypes = [
    "video/mp4;codecs=avc1,mp4a.40.2", // H.264 + AAC (most compatible)
    "video/mp4;codecs=vp9,opus", // VP9 + Opus (newer, open codecs)
    "video/mp4", // Generic fallback
  ];

  let mimeType = mimeTypes[0];
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      mimeType = type;
      break;
    }
  }

  const recorder = new MediaRecorder(stream, { mimeType });
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
    const progress = Math.round((frame / totalFrames) * 100);

    // Report progress
    if (onProgress) {
      onProgress(progress);
    }

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
      const blob = new Blob(chunks, { type: "video/mp4" });
      resolve(blob);
    };

    void renderFrame();
  });
}
