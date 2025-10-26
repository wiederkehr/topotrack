/**
 * Check if the browser supports MP4 video recording via MediaRecorder API.
 * Requires Chrome 126+ (June 2024) or equivalent browser.
 *
 * @returns true if MP4 is supported, false otherwise
 */
export function checkMp4Support(): boolean {
  if (typeof MediaRecorder === "undefined") {
    return false;
  }

  // Try MP4 with different codec combinations
  const mimeTypes = [
    "video/mp4;codecs=avc1,mp4a.40.2", // H.264 + AAC (most compatible)
    "video/mp4;codecs=vp9,opus", // VP9 + Opus (newer, open codecs)
    "video/mp4", // Generic fallback
  ];

  return mimeTypes.some((type) => MediaRecorder.isTypeSupported(type));
}
