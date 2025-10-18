import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useMemo, useRef, useState } from "react";
import MapGL, { MapRef } from "react-map-gl";

import { altitudeToZoom } from "./functions/altitudeToZoom";
import { resetCameraPositionState } from "./functions/computeCameraPosition";
import { flyToPoint } from "./functions/flyToPoint";
import { followPath } from "./functions/followPath";
import styles from "./map.module.css";
import { Position } from "./position";
import { Route } from "./route";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapGLAnimatedProps = {
  data: [number, number][];
  padding?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  progressColor: string;
  routeColor: string;
  style: string;
};

function MapGLAnimated({
  data,
  padding,
  style,
  progressColor,
  routeColor,
}: MapGLAnimatedProps) {
  // Data
  // //////////////////////////////
  const routeData = data;
  const startPosition = useMemo<[number, number]>(
    () => routeData[0] || ([0, 0] as [number, number]),
    [routeData],
  );

  // Layout
  // //////////////////////////////
  const paddingTop = padding?.top ?? 0;
  const paddingBottom = padding?.bottom ?? 0;
  const paddingLeft = padding?.left ?? 0;
  const paddingRight = padding?.right ?? 0;

  // State
  // //////////////////////////////
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [progressData, setProgressData] = useState<[number, number][]>([]);

  // Animation parameters
  // //////////////////////////////
  const startAltitude = 10000;
  const stopAltitude = 4000;
  const startBearing = 0;
  const stopBearing = 0;
  const startPitch = 0;
  const stopPitch = 60;

  // Calculate initial zoom from startAltitude to avoid flicker
  const startZoom = useMemo(
    () => altitudeToZoom(startAltitude, startPosition[1]),
    [startAltitude, startPosition],
  );

  // Map
  // //////////////////////////////
  const mapRef = useRef<MapRef>(null);
  const mapConfig = {
    longitude: startPosition[0],
    latitude: startPosition[1],
    bearing: startBearing,
    pitch: startPitch,
    zoom: startZoom,
  };

  // Animate Route
  // //////////////////////////////
  const animateRoute = useCallback(async () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    // Reset camera position state for smooth new animation sequence
    resetCameraPositionState();

    // Initialize progress tracking with 2 points (minimum for lineString)
    setCurrentPosition(startPosition);
    setProgressData([startPosition, startPosition]);

    // Phase 1: Fly to start point
    // //////////////////////////////
    const flyToPointDuration = 2000;
    const afterFlyInPosition = await flyToPoint({
      map: map,
      targetPosition: {
        lng: startPosition[0],
        lat: startPosition[1],
      },
      duration: flyToPointDuration,
      startAltitude: startAltitude,
      stopAltitude: stopAltitude,
      startBearing: startBearing,
      stopBearing: stopBearing,
      startPitch: startPitch,
      stopPitch: stopPitch,
    });

    // Phase 2: Follow the path
    // //////////////////////////////
    const followPathDuration = 6000;
    await followPath({
      map: map,
      duration: followPathDuration,
      path: lineString(routeData),
      altitude: afterFlyInPosition.altitude,
      pitch: afterFlyInPosition.pitch,
      lookAheadDistance: 0.5,
      bearingDamping: 0.95,
      onUpdate: (pointData) => {
        setCurrentPosition([pointData.lng, pointData.lat]);
        setProgressData((prev) => [...prev, [pointData.lng, pointData.lat]]);
      },
    });

    // Phase 3: Zoom out to show entire route
    // //////////////////////////////
    const fitBoundsDuration = 2000;
    const routeLineString = lineString(routeData);
    const routeBboxArray = bbox(routeLineString);
    const routeBbox: LngLatBoundsLike = [
      routeBboxArray[0],
      routeBboxArray[1],
      routeBboxArray[2],
      routeBboxArray[3],
    ];
    map.fitBounds(routeBbox, {
      duration: fitBoundsDuration,
      bearing: 0,
      pitch: 0,
      padding: {
        top: paddingTop,
        bottom: paddingBottom,
        left: paddingLeft,
        right: paddingRight,
      },
    });
  }, [
    routeData,
    startPosition,
    startBearing,
    startPitch,
    startAltitude,
    stopAltitude,
    stopBearing,
    stopPitch,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  ]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={() => void animateRoute()}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
        interactive={false}
      >
        <Route
          data={routeData}
          lineColor={routeColor ?? "#FFF"}
          lineWidth={2}
        />
        {progressData.length >= 2 && (
          <>
            <Route
              data={progressData}
              lineColor={progressColor ?? "#FFF"}
              lineWidth={2}
            />
            <Position data={currentPosition} color={progressColor} />
          </>
        )}
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
