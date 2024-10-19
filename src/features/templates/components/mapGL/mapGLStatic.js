import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString } from "@turf/turf";
import { useCallback, useEffect, useRef } from "react";
import MapGL from "react-map-gl";

import styles from "./map.module.css";
import Route from "./route";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapGLStatic({ data, style, accent, format }) {
  // Data
  // //////////////////////////////
  const latlng = data;
  const lnglat = latlng.map((d) => [d[1], d[0]]);
  // Features
  // //////////////////////////////
  const routeData = lnglat;
  const positionData = routeData[0];
  // Map
  // //////////////////////////////
  const startBearing = 0;
  const startPitch = 40;
  const mapRef = useRef();
  const mapConfig = {
    longitude: positionData[0],
    latitude: positionData[1],
    bearing: startBearing,
    pitch: startPitch,
    zoom: 12,
  };

  // Fit Bounds
  // //////////////////////////////
  const onMapLoad = useCallback(async () => {
    mapRef.current.fitBounds(bbox(lineString(routeData)), {
      duration: 300,
      bearing: startBearing,
      pitch: startPitch,
      padding: 32,
    });
  }, [routeData, startBearing, startPitch]);

  useEffect(() => {
    if (mapRef.current) {
      onMapLoad();
    }
  }, [data, onMapLoad]);

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
        <Route data={routeData} color={accent} />
      </MapGL>
    </div>
  );
}
