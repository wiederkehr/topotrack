export const formats = [
  { name: "Square", width: 1080, height: 1080 },
  { name: "Landscape", width: 1920, height: 1080 },
  { name: "Portrait", width: 1080, height: 1920 },
];

export const themes = [
  {
    name: "Light",
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
    name: "Dark",
    variables: [
      {
        name: "Foreground",
        options: ["Light Blue", "Light Green", "Light Purple"],
      },
      {
        name: "Background",
        options: ["Dark Blue", "Dark Green", "Dark Purple"],
      },
    ],
  },
];

export const assets = [
  { name: "Static PNG", file: "png" },
  { name: "Static SVG", file: "svg" },
  { name: "Animated MOV", file: "mov" },
];
