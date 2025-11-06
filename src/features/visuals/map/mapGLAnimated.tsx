import "mapbox-gl/dist/mapbox-gl.css";

import { bbox, lineString, simplify } from "@turf/turf";
import { useEffect, useMemo, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import {
  calculateFollowBearing,
  mapAnimations,
  playAnimation,
} from "@/features/visuals/map/animations";

import { altitudeToZoom } from "./conversions/altitudeToZoom";
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
 * Uses the new real-time animation system:
 * 1. Renders simplified route for display
 * 2. Uses mapAnimations to create animation sequence
 * 3. Executes animation via playAnimation() on map load
 * 4. Real-time calculation supports both preview and frame-by-frame export
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

  // Calculate bounds for fitBounds animation
  const bounds = useMemo(() => {
    if (routeData.length < 2) return null;
    return bbox(lineString(routeData));
  }, [routeData]);

  // Initial map config
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

  // Play animation on map load
  useEffect(() => {
    if (!mapRef.current || routeData.length < 2) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    const playMapAnimation = async () => {
      try {
        const startPosition = routeData[0] as [number, number];

        // Calculate initial bearing for seamless transition from flyTo to followPath
        const initialBearing = calculateFollowBearing(
          startPosition,
          routeData,
          0.15, // 15% look-ahead
        );

        // Create animation sequence
        const animation = mapAnimations.sequence(
          // Fly to start of route with calculated bearing
          mapAnimations.flyTo({
            center: startPosition,
            bearing: initialBearing,
            zoom: 13,
            duration: 1000,
          }),

          // Follow the route with dynamic bearing
          mapAnimations.followPath({
            route: routeData,
            duration: 5000, // 5 second route playback
            bearingOptions: {
              type: "dynamic",
              bearing: initialBearing,
              lookAhead: 0.15,
              damping: 0.7,
            },
          }),

          // Fit to bounds at end
          bounds
            ? mapAnimations.fitBounds({
                bounds: bounds as Parameters<
                  typeof mapAnimations.fitBounds
                >[0]["bounds"],
                duration: 1000,
              })
            : mapAnimations.wait(100),
        );

        // Execute animation
        await playAnimation(map, animation);
      } catch (error) {
        console.error("Animation failed:", error);
      }
    };

    // Start animation with a small delay to allow map to render
    const timeout = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      playMapAnimation();
    }, 500);
    return () => clearTimeout(timeout);
  }, [routeData, bounds]);

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
          data={simplifiedRouteData}
          line={{
            id: "full",
            lineColor: routeColor ?? "#FFF",
            lineWidth: 8,
          }}
        />

        {/* Progress route - starts empty, updated during animation */}
        <Route
          data={simplifiedRouteData.slice(0, 2)}
          line={{
            id: "progress",
            lineColor: progressColor ?? "#FFF",
            lineWidth: 2,
          }}
        />

        {/* Current position marker - starts at beginning */}
        <Position
          id="progress-position"
          data={routeData[0] || [0, 0]}
          circleColor={progressColor ?? "#FFF"}
        />
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
