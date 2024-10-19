import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { useCallback, useEffect, useRef, useState } from "react";
import MapGL from "react-map-gl";

import flyToPoint from "@/functions/map/flyToPoint";
import followPath from "@/functions/map/followPath";

import styles from "./map.module.css";
import Position from "./position";
import Route from "./route";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapGLAnimated({
  data,
  style,
  accent,
  contrast,
  format,
}) {
  // Data
  // //////////////////////////////
  const latlng = data;
  const lnglat = latlng.map((d) => [d[1], d[0]]);
  // Features
  // //////////////////////////////
  const routeData = lnglat;
  const [positionData, setPositionData] = useState(routeData[0]);
  const [progressData, setProgressData] = useState([
    routeData[0],
    routeData[0],
  ]);
  // Map
  // //////////////////////////////
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
  // //////////////////////////////
  const durationFly = 5000;
  const durationFollow = 10000;

  // Fly To Point
  // //////////////////////////////
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

    // Follow Path
    // //////////////////////////////
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

    // Fit Bounds
    // //////////////////////////////
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

  // Update on Format Change
  // //////////////////////////////
  useEffect(() => {
    if (mapRef.current) {
    }
  }, [format]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={onMapLoad}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Route data={routeData} color={contrast} />
        <Route data={progressData} color={accent} />
        <Position data={positionData} color={accent} />
      </MapGL>
    </div>
  );
}
