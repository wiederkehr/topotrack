import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import styles from "./map.module.css";
import Route from "./route";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapGLStaticProps = {
  accent: string;
  data: [number, number][];
  format: string;
  style: string;
};

function MapGLStatic({ data, style, accent }: MapGLStaticProps) {
  // Data
  // //////////////////////////////
  const latlng = data;
  const lnglat = latlng.map((d) => [d[1], d[0]] as [number, number]);
  // Features
  // //////////////////////////////
  const routeData = lnglat;
  const positionData = routeData[0];
  // Map
  // //////////////////////////////
  const startBearing = 0;
  const startPitch = 40;
  const mapRef = useRef<MapRef>(null);
  const mapConfig = {
    longitude: positionData ? positionData[0] : 0,
    latitude: positionData ? positionData[1] : 0,
    bearing: startBearing,
    pitch: startPitch,
    zoom: 12,
  };

  // Fit Bounds
  // //////////////////////////////
  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;

    const routeLineString = lineString(routeData);
    const routeBboxArray = bbox(routeLineString);
    const routeBbox: LngLatBoundsLike = [
      routeBboxArray[0],
      routeBboxArray[1],
      routeBboxArray[2],
      routeBboxArray[3],
    ];
    mapRef.current.fitBounds(routeBbox, {
      duration: 300,
      bearing: startBearing,
      pitch: startPitch,
      padding: 32,
    });
  }, [routeData, startBearing, startPitch]);

  // Update on onMapLoad Change
  // //////////////////////////////
  useEffect(() => {
    if (mapRef.current) {
      void onMapLoad();
    }
  }, [onMapLoad]);

  return (
    <div className={styles.map}>
      <MapGL
        ref={mapRef}
        onLoad={void onMapLoad}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
      >
        <Route data={routeData} color={accent} />
      </MapGL>
    </div>
  );
}

export { MapGLStatic };
