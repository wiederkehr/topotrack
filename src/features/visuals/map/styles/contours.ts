import chroma from "chroma-js";
import type { BackgroundLayer, LineLayer, Style } from "mapbox-gl";

type MapStyleProps = {
  backgroundColor?: string;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
};

export function getContourColor(color: string = "#fff"): string {
  const colorLuminance = chroma(color).luminance();
  if (colorLuminance <= 0.5) {
    return chroma(color).brighten(0.4).hex();
  } else {
    return chroma(color).darken(0.4).hex();
  }
}

export function mapStyle(options?: MapStyleProps): Style {
  const {
    backgroundColor = "#000",
    lineColor = "#fff",
    lineWidth = 1,
    lineOpacity = 1,
  } = options || {};

  return {
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": backgroundColor,
        },
      } as BackgroundLayer,
      {
        id: "contour",
        type: "line",
        source: "mapbox-terrain",
        "source-layer": "contour",
        paint: {
          "line-color": lineColor,
          "line-width": lineWidth,
          "line-opacity": lineOpacity,
        },
      } as LineLayer,
    ],
    sources: {
      "mapbox-terrain": {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      },
    },
    version: 8,
  };
}
