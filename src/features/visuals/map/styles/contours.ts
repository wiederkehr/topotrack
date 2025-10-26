import type { Style } from "mapbox-gl";

type MapStyleProps = {
  backgroundColor?: string;
  contourColor?: string;
  contourOpacity?: number;
  contourWidth?: number;
};

export function mapStyle(options?: MapStyleProps): Style {
  const {
    backgroundColor = "#000",
    contourColor = "#fff",
    contourWidth = 1,
    contourOpacity = 1,
  } = options || {};

  return {
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": backgroundColor,
        },
      },
      {
        id: "contour",
        type: "line",
        source: "mapbox-terrain",
        "source-layer": "contour",
        paint: {
          "line-color": contourColor,
          "line-width": contourWidth,
          "line-opacity": contourOpacity,
        },
      },
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
