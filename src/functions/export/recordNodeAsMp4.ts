import html2canvas from "html2canvas";

import type { FormatType } from "@/types";

type RecordNodeAsMp4Props = {
  duration?: number;
  format?: FormatType;
  fps?: number;
  node: HTMLElement;
  onProgress?: (progress: number) => void;
};

/**
 * Records an HTML node as an MP4 video using canvas-record library.
 * Uses WebCodecs when available for fast encoding (10x faster than realtime).
 *
 * IMPORTANT: This function uses dynamic imports to load canvas-record only when needed,
 * preventing the large library from being bundled into the main page bundle.
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
  try {
    // Dynamically import canvas-record only when MP4 export is triggered
    // This prevents the large library (~4MB) from being bundled into the page
    const { Recorder } = await import("canvas-record");

    const width = format?.width ?? node.offsetWidth;
    const height = format?.height ?? node.offsetHeight;

    // Create a temporary canvas for recording
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not create canvas context");
    }

    // Create recorder with MP4 format using canvas-record API
    const recorder = new Recorder(ctx, {
      name: "topotrack",
      extension: "mp4",
      duration: duration / 1000, // Convert ms to seconds
      frameRate: fps,
      download: false, // We'll handle the blob ourselves
      encoderOptions: {
        bitrate: 8000000, // 8 Mbps for high quality
      },
    });

    const totalFrames = Math.floor((duration / 1000) * fps);
    let frame = 0;

    // Start recording
    await recorder.start();

    // Render each frame
    async function renderFrame(): Promise<void> {
      // Capture the current state of the node as a canvas
      const bitmap = await html2canvas(node, { width, height });

      // Draw to our recording canvas (ctx is guaranteed to exist after check above)
      ctx!.clearRect(0, 0, width, height);
      ctx!.drawImage(bitmap, 0, 0);

      // Record this frame
      await recorder.step();

      frame++;
      const progress = Math.round((frame / totalFrames) * 100);

      // Report progress
      if (onProgress) {
        onProgress(progress);
      }

      if (frame < totalFrames) {
        // Continue to next frame
        await renderFrame();
      }
    }

    await renderFrame();

    // Stop recording and get the buffer
    const buffer = recorder.stop();

    // Clean up
    await recorder.dispose();

    // Convert buffer to Blob
    if (buffer) {
      // Handle different buffer types that can be returned
      if (buffer instanceof Blob) {
        return buffer;
      } else if (Array.isArray(buffer)) {
        // Array of Blobs
        return new Blob(buffer, { type: "video/mp4" });
      } else {
        // ArrayBuffer or Uint8Array
        return new Blob([buffer], { type: "video/mp4" });
      }
    }

    return null;
  } catch (error) {
    console.error("Error recording MP4:", error);
    return null;
  }
}
