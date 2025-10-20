import html2canvas from "html2canvas-pro";

import { useExportStore } from "@/stores";
import type { FormatType } from "@/types";

type RecordNodeAsMp4Props = {
  format?: FormatType;
  fps?: number;
  node: HTMLElement;
  onProgress?: (progress: number) => void;
  useFrameByFrame?: boolean;
};

/**
 * Records an HTML node as an MP4 video using native browser MediaRecorder API.
 * Requires Chrome 126+ (June 2024) or equivalent browser with MP4 support.
 *
 * Supports two modes:
 * 1. Frame-by-frame mode (useFrameByFrame=true): Coordinates with AnimationController via useExportStore
 *    for perfect frame synchronization. Duration comes from the animation config.
 * 2. Legacy mode (useFrameByFrame=false): Uses html2canvas with setTimeout for static content.
 *    Requires explicit duration parameter.
 *
 * @param props - Recording configuration
 * @returns Promise that resolves to a Blob containing the MP4 video
 *
 * @example Frame-by-frame mode (for animations):
 * ```ts
 * const blob = await recordNodeAsMp4({
 *   node: document.getElementById('animation'),
 *   format: { width: 1080, height: 1080, name: 'Square' },
 *   fps: 30,
 *   useFrameByFrame: true,
 *   onProgress: (progress) => console.log(`${progress}% complete`),
 * });
 * ```
 *
 * @example Legacy mode (for static content):
 * ```ts
 * const blob = await recordNodeAsMp4({
 *   node: document.getElementById('static'),
 *   format: { width: 1080, height: 1080, name: 'Square' },
 *   fps: 30,
 *   useFrameByFrame: false,
 *   onProgress: (progress) => console.log(`${progress}% complete`),
 * });
 * ```
 */
export async function recordNodeAsMp4({
  node,
  format,
  fps = 30,
  useFrameByFrame = false,
  onProgress,
}: RecordNodeAsMp4Props): Promise<Blob | null> {
  // Get duration from export store if using frame-by-frame mode
  const duration = useFrameByFrame
    ? (useExportStore.getState().animationDuration ?? 10000)
    : 10000;
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

  /**
   * Frame-by-frame rendering mode - coordinates with AnimationController via store
   */
  function renderFrameControlled() {
    const timestamp = (frame / fps) * 1000; // Convert frame number to milliseconds
    const progress = Math.round((frame / totalFrames) * 100);

    // Report progress to callback and store
    if (onProgress) {
      onProgress(progress);
    }
    useExportStore.getState().setExportProgress(progress);

    if (frame < totalFrames) {
      // Set up callback for when frame is ready
      useExportStore.getState().setFrameReadyCallback(() => {
        // Once frame is rendered, capture it to canvas
        void captureNodeToCanvas().then(() => {
          frame++;
          // Render next frame
          void renderFrameControlled();
        });
      });

      // Request animation to render at this timestamp
      useExportStore.getState().setExportTimestamp(timestamp);
    } else {
      // Animation complete - cleanup and stop recording
      useExportStore.getState().setExportMode(false);
      useExportStore.getState().setFrameReadyCallback(null);
      recorder.stop();
    }
  }

  /**
   * Legacy rendering mode - uses html2canvas with setTimeout
   */
  async function renderFrameLegacy() {
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
        void renderFrameLegacy();
      }, 1000 / fps);
    } else {
      recorder.stop();
    }
  }

  /**
   * Capture the current node state to canvas using html2canvas
   */
  async function captureNodeToCanvas() {
    const bitmap = await html2canvas(node, { width, height });
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0);
  }

  return new Promise<Blob | null>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      resolve(blob);
    };

    // Choose rendering mode
    if (useFrameByFrame) {
      // Enable export mode in store
      useExportStore.getState().setExportMode(true);
      useExportStore.getState().setExportTimestamp(0);
      void renderFrameControlled();
    } else {
      void renderFrameLegacy();
    }
  });
}
