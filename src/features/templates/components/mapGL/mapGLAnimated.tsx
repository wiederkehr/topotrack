import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { MapRef } from "react-map-gl";

import type { FormatType } from "@/types";

import { flyToPoint } from "./functions/flyToPoint";
import { followPath } from "./functions/followPath";
import styles from "./map.module.css";
import { Position } from "./position";
import { Route } from "./route";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapGLAnimatedProps = {
  accent: string;
  contrast: string;
  data: [number, number][];
  format: FormatType;
  style: string;
};

function MapGLAnimated({
  data,
  style,
  accent,
  contrast,
  format,
}: MapGLAnimatedProps) {
  // Data
  // //////////////////////////////
  const latlng = data;
  const lnglat = latlng.map((d) => [d[1], d[0]] as [number, number]);
  // Features
  // //////////////////////////////
  const routeData = lnglat;
  const [positionData, setPositionData] = useState<[number, number]>(
    routeData[0] || [0, 0],
  );
  const [progressData, setProgressData] = useState<[number, number][]>([
    routeData[0] || [0, 0],
    routeData[0] || [0, 0],
  ]);
  // Map
  // //////////////////////////////
  const startAltitude = 100000;
  const stopAltitude = 5000;
  const startBearing = -60;
  const stopBearing = 0;
  const startPitch = 0;
  const stopPitch = 50;
  const mapRef = useRef<MapRef>(null);
  const mapConfig = {
    longitude: positionData ? positionData[0] : 0,
    latitude: positionData ? positionData[1] : 0,
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
    if (!mapRef.current) return;

    const afterFlyInPosition = await flyToPoint({
      map: mapRef.current.getMap(),
      targetPosition: {
        lng: positionData[0] || 0,
        lat: positionData[1] || 0,
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
    await followPath({
      map: mapRef.current.getMap(),
      duration: durationFollow,
      path: lineString(routeData),
      altitude: afterFlyInPosition.altitude,
      bearing: afterFlyInPosition.bearing,
      pitch: afterFlyInPosition.pitch,
      onUpdate: (pointData) => {
        setPositionData([pointData.lng, pointData.lat]);
        setProgressData((prev) => [...prev, [pointData.lng, pointData.lat]]);
      },
    });

    // Fit Bounds
    // //////////////////////////////
    const routeLineString = lineString(routeData);
    const routeBboxArray = bbox(routeLineString);
    const routeBbox: LngLatBoundsLike = [
      routeBboxArray[0],
      routeBboxArray[1],
      routeBboxArray[2],
      routeBboxArray[3],
    ];
    mapRef.current.getMap().fitBounds(routeBbox, {
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
      // Add any necessary logic here if needed
    }
  }, [format]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={void onMapLoad()}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Route data={routeData} lineColor={contrast ?? "#FFF"} lineWidth={2} />
        <Route data={progressData} lineColor={accent ?? "#FFF"} lineWidth={2} />
        <Position data={positionData} color={accent} />
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
