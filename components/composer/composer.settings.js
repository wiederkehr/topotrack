export const formats = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Landscape", width: 1920, height: 1080 },
  { name: "Portrait", width: 1080, height: 1920 },
];

export const templates = [
  {
    name: "Poster",
    variables: [
      {
        name: "Foreground",
        options: ["Dark Blue", "Dark Green", "Dark Purple"],
      },
      {
        name: "Background",
        options: ["Light Blue", "Light Green", "Light Purple"],
      },
    ],
  },
  {
    name: "Map",
    variables: [
      {
        name: "Theme",
        options: ["Light", "Dark"],
      },
      {
        name: "Background",
        options: ["Dark Blue", "Dark Green", "Dark Purple"],
      },
      {
        name: "Animation",
        options: ["None", "Mild", "Wild"],
      },
    ],
  },
];

export const assets = [
  { name: "Static PNG", type: "png" },
  { name: "Static SVG", type: "svg" },
  { name: "Animated MP4", type: "mp4" },
];
