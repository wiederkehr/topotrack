import type { Style } from "mapbox-gl";

type MapStyleProps = {
  backgroundColor?: string;
  contourColor?: string;
  contourOpacity?: number;
  contourWidth?: number;
  hillshadeAccent?: string;
  hillshadeExaggeration?: number;
  hillshadeHighlight?: string;
  hillshadeShadow?: string;
};

export function mapStyle(options?: MapStyleProps): Style {
  const {
    backgroundColor = "#000",
    contourColor = "#fff",
    contourWidth = 1,
    contourOpacity = 1,
    hillshadeShadow = "#000",
    hillshadeHighlight = "#fff",
    hillshadeAccent = "#000",
    hillshadeExaggeration = 0.5,
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
        id: "hillshade",
        type: "hillshade",
        source: "mapbox-terrain-dem",
        paint: {
          "hillshade-shadow-color": hillshadeShadow,
          "hillshade-highlight-color": hillshadeHighlight,
          "hillshade-accent-color": hillshadeAccent,
          "hillshade-exaggeration": hillshadeExaggeration,
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
      "mapbox-terrain-dem": {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      },
    },
    // terrain: { source: "mapbox-terrain-dem", exaggeration: 1 },
    version: 8,
  };
}
