import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { useMemo, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import type { AnimationConfig } from "@/features/visuals/animation";
import { AnimationController } from "@/features/visuals/animation";
import {
  calculateFitBoundsDuration,
  calculateFlyToDuration,
  calculateFollowPathDuration,
} from "@/features/visuals/animation";

import { altitudeToZoom } from "./functions/altitudeToZoom";
import { getInitialBearing } from "./functions/getInitialBearing";
import styles from "./map.module.css";
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
  progressColor?: string; // Optional for future progress visualization
  routeColor: string;
  style: string;
};

function MapGLAnimated({
  data,
  padding,
  style,
  routeColor,
}: MapGLAnimatedProps) {
  const routeData = data;
  const startPosition = useMemo<[number, number]>(
    () => routeData[0] || ([0, 0] as [number, number]),
    [routeData],
  );

  // Animation parameters
  const startAltitude = 10000;
  const stopAltitude = 4000;
  const startBearing = 0;
  const startPitch = 0;
  const stopPitch = 60;
  const lookAheadDistance = 0.5;

  // Map reference
  const mapRef = useRef<MapRef>(null);

  // Calculate initial zoom from startAltitude to avoid flicker
  const startZoom = useMemo(
    () => altitudeToZoom(startAltitude, startPosition[1]),
    [startAltitude, startPosition],
  );

  const mapConfig = {
    longitude: startPosition[0],
    latitude: startPosition[1],
    bearing: startBearing,
    pitch: startPitch,
    zoom: startZoom,
  };

  // Build animation configuration declaratively
  const animationConfig: AnimationConfig = useMemo(() => {
    const routeLineString = lineString(routeData);
    const routeBboxArray = bbox(routeLineString);
    const stopBearing = getInitialBearing({
      path: routeLineString,
      lookAheadDistance,
    });

    return {
      phases: [
        // Phase 1: Fly to start point
        {
          type: "flyTo" as const,
          duration: calculateFlyToDuration(),
          params: {
            startAltitude,
            stopAltitude,
            startBearing,
            stopBearing,
            startPitch,
            stopPitch,
            targetLng: startPosition[0],
            targetLat: startPosition[1],
          },
        },
        // Phase 2: Follow the path
        {
          type: "followPath" as const,
          duration: calculateFollowPathDuration(routeData),
          params: {
            path: routeLineString,
            altitude: stopAltitude,
            pitch: stopPitch,
            lookAheadDistance,
            bearingDamping: 0.95,
          },
        },
        // Phase 3: Zoom out to show entire route
        {
          type: "fitBounds" as const,
          duration: calculateFitBoundsDuration(),
          params: {
            boundsWest: routeBboxArray[0],
            boundsSouth: routeBboxArray[1],
            boundsEast: routeBboxArray[2],
            boundsNorth: routeBboxArray[3],
            bearing: 0,
            pitch: 0,
            paddingTop: padding?.top ?? 0,
            paddingBottom: padding?.bottom ?? 0,
            paddingLeft: padding?.left ?? 0,
            paddingRight: padding?.right ?? 0,
          },
        },
      ],
    };
  }, [
    routeData,
    startPosition,
    startAltitude,
    stopAltitude,
    startBearing,
    startPitch,
    stopPitch,
    lookAheadDistance,
    padding,
  ]);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
        interactive={false}
        preserveDrawingBuffer={true}
      >
        <Route
          data={routeData}
          lineColor={routeColor ?? "#FFF"}
          lineWidth={2}
        />

        <AnimationController
          config={animationConfig}
          map={mapRef.current?.getMap() ?? null}
        />
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
