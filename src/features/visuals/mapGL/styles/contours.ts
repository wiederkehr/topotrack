import type { BackgroundLayer, LineLayer, Style } from "mapbox-gl";

type MapStyleOptions = {
  backgroundColor?: string;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
};

export function mapStyle(options?: MapStyleOptions): Style {
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
