import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import styles from "./map.module.css";
import type { mapStyle } from "./styles/contours";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapGLStaticProps = {
  children?: React.ReactNode;
  data: [number, number][];
  mapStyle: ReturnType<typeof mapStyle>;
  padding?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
};

function MapGLStatic({ data, mapStyle, padding, children }: MapGLStaticProps) {
  // Data
  // //////////////////////////////
  const routeData = data;
  const positionData = routeData[0];
  // Layout
  // //////////////////////////////
  const paddingTop = padding?.top ?? 0;
  const paddingBottom = padding?.bottom ?? 0;
  const paddingLeft = padding?.left ?? 0;
  const paddingRight = padding?.right ?? 0;
  // Map
  // //////////////////////////////
  const bearing = 0;
  const pitch = 0;
  const mapRef = useRef<MapRef>(null);
  const mapConfig = {
    longitude: positionData ? positionData[0] : 0,
    latitude: positionData ? positionData[1] : 0,
    bearing: bearing,
    pitch: pitch,
    zoom: 12,
  };

  // Fit Bounds
  // //////////////////////////////
  const fitRouteToBounds = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map.loaded()) return;

    const routeLineString = lineString(routeData);
    const routeBboxArray = bbox(routeLineString);
    const routeBbox: LngLatBoundsLike = [
      routeBboxArray[0],
      routeBboxArray[1],
      routeBboxArray[2],
      routeBboxArray[3],
    ];
    map.fitBounds(routeBbox, {
      duration: 300,
      bearing: bearing,
      pitch: pitch,
      padding: {
        top: paddingTop,
        bottom: paddingBottom,
        left: paddingLeft,
        right: paddingRight,
      },
    });
  }, [
    routeData,
    bearing,
    pitch,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  ]);

  // Update map on load and when data changes
  // //////////////////////////////
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    if (map.loaded()) {
      fitRouteToBounds();
    } else {
      map.once("idle", fitRouteToBounds);
    }
  }, [fitRouteToBounds, routeData]);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        onLoad={fitRouteToBounds}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        interactive={false}
        attributionControl={false}
        preserveDrawingBuffer={true}
      >
        {children}
      </MapGL>
    </div>
  );
}

export { MapGLStatic };
