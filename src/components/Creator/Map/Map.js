import { useState } from "react";
import MapGL from "react-map-gl";
import { min, max, mean } from "d3";
import useAnimationFrame from "use-animation-frame";

import createLine from "@/functions/createLine";
import createPoint from "@/functions/createPoint";
import { colors } from "@/styles/constants";

import Position from "./Position";
import Route from "./Route";
import styles from "./Map.module.css";

import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE =
  "mapbox://styles/benjaminwiederkehr/clmr134ih01y301rchfii6ey6";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const FRAMERATE = 60;
const DURATION = 10;
const FRAMES = FRAMERATE * DURATION;

export default function Map({ data }) {
  const latlng = data.find((d) => d.type === "latlng");
  const lnglat = latlng.data.map((d) => [d[1], d[0]]);
  const lats = latlng.data.map((d) => d[0]);
  const lngs = latlng.data.map((d) => d[1]);
  const bounds = {
    ne: [max(lats), max(lngs)],
    se: [min(lats), max(lngs)],
    sw: [min(lats), min(lngs)],
    nw: [max(lats), min(lngs)],
    center: [mean(lats), mean(lngs)],
  };
  const segments = lnglat.length;
  const increment = Math.ceil(segments / FRAMES);

  const [routeData, setRouteData] = useState(createLine(lnglat));
  const [positionData, setPositionData] = useState(createPoint(lnglat[0]));
  const [progressData, setProgressData] = useState(null);
  const [running, setRunning] = useState(false);
  const [counter, setCounter] = useState(0);

  useAnimationFrame(() => {
    setRunning(true);
    const start =
      routeData.coordinates[counter >= segments ? counter - 1 : counter];
    const end =
      routeData.coordinates[counter >= segments ? counter : counter + 1];
    if (!start || !end) {
      setRunning(false);
      return;
    } else {
      setPositionData(createPoint(routeData.coordinates[counter]));
      setProgressData(createLine(routeData.coordinates.slice(0, counter)));
      setCounter(counter + increment);
    }
  });

  const mapConfig = {
    latitude: bounds.center[0],
    longitude: bounds.center[1],
    zoom: 12,
    pitch: 60,
    bearing: 0,
  };

  return (
    <div className={styles.map}>
      <MapGL
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Route data={routeData} color="#fff" />
        <Route data={progressData} color={colors.accent} />
        <Position data={positionData} color={colors.accent} />
      </MapGL>
    </div>
  );
}
