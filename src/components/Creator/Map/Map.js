import Map, { Source, Layer } from "react-map-gl";
import { min, max, mean } from "d3";

import { colors } from "@/styles/constants";
import styles from "./Map.module.css";

import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE =
  "mapbox://styles/benjaminwiederkehr/clmr134ih01y301rchfii6ey6";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function ActivityMap({ data }) {
  const latlng = data.find((d) => d.type === "latlng");
  const lats = latlng.data.map((d) => d[0]);
  const lngs = latlng.data.map((d) => d[1]);
  const bounds = {
    ne: [max(lats), max(lngs)],
    se: [min(lats), max(lngs)],
    sw: [min(lats), min(lngs)],
    nw: [max(lats), min(lngs)],
    center: [mean(lats), mean(lngs)],
  };

  const mapConfig = {
    latitude: bounds.center[0],
    longitude: bounds.center[1],
    zoom: 12,
    pitch: 60,
    bearing: 0,
  };

  const routeFeatures = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: latlng.data.map((d) => [d[1], d[0]]),
        },
      },
    ],
  };

  return (
    <div className={styles.map}>
      <Map
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Source id="route-source" type="geojson" data={routeFeatures}>
          <Layer
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#fff",
              "line-width": 4,
            }}
          />
          <Layer
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": colors.accent,
              "line-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
