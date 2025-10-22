import "mapbox-gl/dist/mapbox-gl.css";

import { lineString, simplify } from "@turf/turf";
import { useMemo, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import {
  AnimationControllerPreview,
  DEFAULT_ANIMATION_SETTINGS,
  ExportAnimationController,
  preCalculateAnimation,
  type PreCalculatedAnimation,
} from "@/features/visuals/animation";

import { altitudeToZoom } from "./functions/altitudeToZoom";
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
  progressColor?: string;
  routeColor: string;
  style: string;
};

/**
 * MapGLAnimated - Route animation visualization with Mapbox GL.
 *
 * Architecture:
 * 1. Pre-calculates all animation data at setup (one-time)
 * 2. Renders simplified route for display
 * 3. Mounts AnimationControllerPreview for smooth preview playback
 * 4. Mounts ExportAnimationController for frame-by-frame export
 * Both controllers use identical pre-calculated keyframes → zero drift
 */
function MapGLAnimated({
  data,
  style,
  routeColor,
  progressColor,
}: MapGLAnimatedProps) {
  const routeData = data;
  const mapRef = useRef<MapRef>(null);

  // Simplify route for display (keep original for precise calculations)
  const simplifiedRouteData = useMemo(() => {
    if (routeData.length < 100) return routeData;

    const line = lineString(routeData);
    const simplified = simplify(line, {
      tolerance: 0.0001,
      highQuality: false,
    });
    return simplified.geometry.coordinates as [number, number][];
  }, [routeData]);

  // Pre-calculate all animation data at setup time
  const preCalculated = useMemo<PreCalculatedAnimation | null>(() => {
    if (routeData.length < 2) return null;

    try {
      return preCalculateAnimation(routeData, {
        ...DEFAULT_ANIMATION_SETTINGS,
        // Override with padding if provided
      });
    } catch (error) {
      console.error("Failed to pre-calculate animation:", error);
      return null;
    }
  }, [routeData]);

  // Initial map config from first keyframe if available
  const mapConfig = useMemo(() => {
    const startPosition = routeData[0] || [0, 0];
    const startAltitude = 10000;

    return {
      longitude: startPosition[0],
      latitude: startPosition[1],
      bearing: 0,
      pitch: 0,
      zoom: altitudeToZoom(startAltitude, startPosition[1]),
    };
  }, [routeData]);

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        mapStyle={style}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={mapConfig}
        attributionControl={false}
        interactive={false}
      >
        {/* Full route - background (simplified for performance) */}
        <Route
          id="full"
          data={simplifiedRouteData}
          lineColor={routeColor ?? "#FFF"}
          lineWidth={8}
        />

        {/* Progress route - updated by controllers, starts empty */}
        <Route
          id="progress"
          data={simplifiedRouteData.slice(0, 2)}
          lineColor={progressColor ?? "#FFF"}
          lineWidth={2}
        />

        {/* Current position marker - updated by controllers */}
        <Position
          data={routeData[0] || [0, 0]}
          color={progressColor ?? "#FFF"}
        />

        {/* Preview animation controller - handles real-time playback */}
        {preCalculated && (
          <AnimationControllerPreview
            preCalculated={preCalculated}
            map={mapRef.current?.getMap() ?? null}
          />
        )}

        {/* Export animation controller - handles frame-by-frame export */}
        {preCalculated && (
          <ExportAnimationController
            preCalculated={preCalculated}
            map={mapRef.current?.getMap() ?? null}
          />
        )}
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
