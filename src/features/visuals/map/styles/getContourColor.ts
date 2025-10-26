import chroma from "chroma-js";

export function getContourColor(color: string = "#fff"): string {
  const colorLuminance = chroma(color).luminance();
  if (colorLuminance <= 0.5) {
    return chroma(color).brighten(0.4).hex();
  } else {
    return chroma(color).darken(0.4).hex();
  }
}
