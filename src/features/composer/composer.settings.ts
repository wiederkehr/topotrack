import { AssetType, FormatType, PresetType } from "@/types";

const formats: FormatType[] = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Portrait", width: 1080, height: 1440 },
  { name: "Landscape", width: 1920, height: 1080 },
  { name: "Story", width: 1080, height: 1920 },
];

const assets: AssetType[] = [
  { name: "Static PNG", type: "png" },
  { name: "Static SVG", type: "svg" },
  { name: "Animated WebM", type: "webm" },
];

const defaultPreset: PresetType = { name: "Custom" };

export { assets, defaultPreset, formats };
