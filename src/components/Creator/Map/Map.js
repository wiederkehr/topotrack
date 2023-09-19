import Map, { Source, Layer } from "react-map-gl";
import { min, max, mean } from "d3";

import styles from "./Map.module.css";

import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE =
  "mapbox://styles/benjaminwiederkehr/clmqpwgot003001pyaw2ic3xj";
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
        terrain={{ source: "terrain-source", exaggeration: 2 }}
        fog={{
          range: [0.8, 8],
          color: "#dc9f9f",
          "horizon-blend": 0.5,
          "high-color": "#245cdf",
          "space-color": "#000000",
          "star-intensity": 0.15,
        }}
      >
        <Source
          id="terrain-source"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
        ></Source>
        <Source id="route-source" type="geojson" data={routeFeatures}>
          <Layer
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#fff",
              "line-width": 2,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
