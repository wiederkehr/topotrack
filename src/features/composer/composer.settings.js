export { default as templates } from "@/features/templates";

export const formats = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Landscape", width: 1920, height: 1080 },
  { name: "Portrait", width: 1080, height: 1920 },
];

export const assets = [
  { name: "Static PNG", type: "png" },
  { name: "Static SVG", type: "svg" },
  { name: "Animated MP4", type: "mp4" },
];
