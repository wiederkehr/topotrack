import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import { min, max, mean } from "d3";

import styles from "./Map.module.css";

import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v12";
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

  const config = {
    latitude: bounds.center[0],
    longitude: bounds.center[1],
    zoom: 12,
    pitch: 0,
    bearing: 0,
  };

  const lines = latlng.data.map((d, i) => ({
    sourcePosition: [d[1], d[0]],
    targetPosition:
      i + 1 < latlng.data.length
        ? [latlng.data[i + 1][1], latlng.data[i + 1][0]]
        : [d[1], d[0]],
  }));

  return (
    <div className={styles.map}>
      <DeckGL initialViewState={config} controller={true}>
        <LineLayer id="line-layer" data={lines} />
        <Map mapboxAccessToken={MAPBOX_TOKEN} mapStyle={MAP_STYLE} />
      </DeckGL>
    </div>
  );
}
