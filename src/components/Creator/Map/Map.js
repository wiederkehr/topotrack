import { useState, useRef, useCallback } from "react";
import { bbox, lineString } from "@turf/turf";
import MapGL from "react-map-gl";
import flyToPoint from "@/functions/flyToPoint";
import followPath from "@/functions/followPath";
import { colors } from "@/styles/constants";
import Position from "./Position";
import Route from "./Route";
import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MAP_STYLE =
  "mapbox://styles/benjaminwiederkehr/clmr134ih01y301rchfii6ey6";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ data }) {
  // Data
  const latlng = data.find((d) => d.type === "latlng").data;
  const lnglat = latlng.map((d) => [d[1], d[0]]);
  // Features
  const routeData = lnglat;
  const [positionData, setPositionData] = useState(routeData[0]);
  const [progressData, setProgressData] = useState([
    routeData[0],
    routeData[0],
  ]);
  // Map
  const startAltitude = 100000;
  const stopAltitude = 5000;
  const startBearing = -60;
  const stopBearing = 0;
  const startPitch = 0;
  const stopPitch = 50;
  const mapRef = useRef();
  const mapConfig = {
    longitude: positionData[0],
    latitude: positionData[1],
    bearing: startBearing,
    pitch: startPitch,
    zoom: 10,
  };
  // Animation
  const durationFly = 5000;
  const durationFollow = 8000;

  const onMapLoad = useCallback(async () => {
    const afterFlyInPosition = await flyToPoint({
      map: mapRef.current,
      targetPosition: {
        lng: positionData[0],
        lat: positionData[1],
      },
      duration: durationFly,
      startAltitude: startAltitude,
      stopAltitude: stopAltitude,
      startBearing: startBearing,
      stopBearing: stopBearing,
      startPitch: startPitch,
      stopPitch: stopPitch,
    });

    const afterFollowPosition = await followPath({
      map: mapRef.current,
      duration: durationFollow,
      path: lineString(routeData),
      altitude: afterFlyInPosition.altitude,
      bearing: afterFlyInPosition.bearing,
      pitch: afterFlyInPosition.pitch,
      onUpdate: ({ pointData, lineData }) => {
        setPositionData(pointData);
        setProgressData(lineData);
      },
    });

    mapRef.current.fitBounds(bbox(lineString(routeData)), {
      duration: 3000,
      bearing: startBearing,
      pitch: startPitch,
      padding: 32,
    });
  }, [
    positionData,
    routeData,
    durationFly,
    startAltitude,
    stopAltitude,
    startBearing,
    stopBearing,
    startPitch,
    stopPitch,
  ]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={onMapLoad}
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
