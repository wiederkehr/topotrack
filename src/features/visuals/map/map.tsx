import "mapbox-gl/dist/mapbox-gl.css";

import { LngLatBoundsLike } from "mapbox-gl";
import { forwardRef, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import styles from "./map.module.css";
import type { mapStyle } from "./styles/contours";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type MapProps = {
  bounds: LngLatBoundsLike;
  children?: React.ReactNode;
  mapConfig?: {
    bearing: number;
    pitch: number;
  };
  mapStyle: ReturnType<typeof mapStyle>;
  onLoad?: () => void;
  padding?: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
};

const Map = forwardRef<MapRef, MapProps>(
  (
    {
      children,
      bounds,
      mapConfig = { bearing: 0, pitch: 0 },
      mapStyle,
      padding,
      onLoad,
    },
    ref,
  ) => {
    // Map
    // //////////////////////////////
    const mapRef = useRef<MapRef>(null);
    const initialViewState = {
      ...mapConfig,
      bounds: bounds,
      fitBoundsOptions: { padding: padding ?? 0 },
    };

    return (
      <div className={styles.mapContainer}>
        <MapGL
          ref={ref || mapRef}
          onLoad={onLoad}
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          interactive={false}
          attributionControl={false}
        >
          {children}
        </MapGL>
      </div>
    );
  },
);

Map.displayName = "Map";

export { Map };
