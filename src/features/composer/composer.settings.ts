type Format = {
  height: number;
  name: string;
  width: number;
};

type Asset = {
  name: string;
  type: string;
};

const formats: Format[] = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Landscape", width: 1920, height: 1080 },
  { name: "Portrait", width: 1080, height: 1920 },
];

const assets: Asset[] = [
  { name: "Static PNG", type: "png" },
  { name: "Static SVG", type: "svg" },
  { name: "Animated MP4", type: "mp4" },
];

export { assets, formats };
