import "mapbox-gl/dist/mapbox-gl.css";

import { along, bbox, length, lineString, simplify } from "@turf/turf";
import { useEffect, useMemo, useRef } from "react";
import MapGL, { MapRef } from "react-map-gl";

import type { AnimationConfig } from "@/features/visuals/animation";
import { AnimationController } from "@/features/visuals/animation";
import {
  calculateFitBoundsDuration,
  calculateFlyToDuration,
  calculateFollowPathDuration,
} from "@/features/visuals/animation";
import { useTemplateStore } from "@/stores";

import { altitudeToZoom } from "./functions/altitudeToZoom";
import { getInitialBearing } from "./functions/getInitialBearing";
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
  progressColor?: string; // Optional for future progress visualization
  routeColor: string;
  style: string;
};

function MapGLAnimated({
  data,
  padding,
  style,
  routeColor,
  progressColor,
}: MapGLAnimatedProps) {
  const routeData = data;
  const startPosition = useMemo<[number, number]>(
    () => routeData[0] || ([0, 0] as [number, number]),
    [routeData],
  );

  // Simplify route for display (keep original for precise progress calculation)
  // This significantly reduces the number of points to render
  const simplifiedRouteData = useMemo(() => {
    if (routeData.length < 100) return routeData; // Don't simplify short routes

    const line = lineString(routeData);
    // tolerance in degrees - 0.0001 degrees is ~11m at equator
    // This is a good balance between visual quality and performance
    const simplified = simplify(line, {
      tolerance: 0.0001,
      highQuality: false,
    });
    return simplified.geometry.coordinates as [number, number][];
  }, [routeData]);

  // Store route line and durations for progress updates
  const routeLineRef = useRef<ReturnType<typeof lineString> | null>(null);
  const totalDistanceRef = useRef<number>(0);
  // Pre-calculate cumulative distances for each point (performance optimization)
  const cumulativeDistancesRef = useRef<number[]>([]);

  // Animation parameters
  const startAltitude = 10000;
  const stopAltitude = 4000;
  const startBearing = 0;
  const startPitch = 0;
  const stopPitch = 40;
  // Increase lookAheadDistance for smoother bearing anticipation
  // 1.5km allows camera to anticipate turns earlier
  const lookAheadDistance = 1;

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

  // Calculate phase durations (memoized separately for use in progress calculation)
  const flyToDuration = useMemo(() => calculateFlyToDuration(), []);
  const followPathDuration = useMemo(
    () => calculateFollowPathDuration(routeData),
    [routeData],
  );
  const fitBoundsDuration = useMemo(() => calculateFitBoundsDuration(), []);

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
          duration: flyToDuration,
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
          duration: followPathDuration,
          params: {
            path: routeLineString,
            altitude: stopAltitude,
            pitch: stopPitch,
            lookAheadDistance,
            // Reduce damping for more responsive bearing changes
            // 0.85 means 15% of change per frame, smoother than 0.95 (5%)
            bearingDamping: 0.85,
          },
        },
        // Phase 3: Zoom out to show entire route
        {
          type: "fitBounds" as const,
          duration: fitBoundsDuration,
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
    flyToDuration,
    followPathDuration,
    fitBoundsDuration,
  ]);

  // Initialize route line and distance cache when route data changes
  useEffect(() => {
    if (routeData.length >= 2) {
      const routeLine = lineString(routeData);
      routeLineRef.current = routeLine;
      totalDistanceRef.current = length(routeLine);

      // Pre-calculate cumulative distances for each point
      // This prevents recalculating on every frame during animation
      const cumulativeDistances: number[] = [0]; // First point is at distance 0
      let accumulatedDistance = 0;

      for (let i = 1; i < routeData.length; i++) {
        const prev = routeData[i - 1];
        const curr = routeData[i];

        if (prev && curr) {
          const segment = lineString([prev, curr]);
          const segmentDistance = length(segment);
          accumulatedDistance += segmentDistance;
          cumulativeDistances.push(accumulatedDistance);
        }
      }

      cumulativeDistancesRef.current = cumulativeDistances;
    }
  }, [routeData]);

  // Update progress imperatively using native Mapbox GL JS
  // This avoids React re-renders on every frame
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !routeLineRef.current) return;

    // Wait for map to be fully loaded before subscribing
    const setupProgressUpdates = () => {
      // Subscribe to animation position changes
      const unsubscribe = useTemplateStore.subscribe((state) => {
        const animationPosition = state.animationPosition;
        const followPathStart = flyToDuration;
        const followPathEnd = flyToDuration + followPathDuration;

        let progress = 0;
        if (animationPosition < followPathStart) {
          progress = 0;
        } else if (animationPosition >= followPathEnd) {
          progress = 1;
        } else {
          progress = (animationPosition - followPathStart) / followPathDuration;
        }

        if (progress > 0 && routeData.length >= 2) {
          const totalDistance = totalDistanceRef.current;
          const currentDistance = totalDistance * progress;
          const cumulativeDistances = cumulativeDistancesRef.current;

          // Get current position for marker
          const currentPoint = along(routeLineRef.current!, currentDistance);
          const coords = currentPoint.geometry.coordinates as [number, number];

          // Find the last point index where cumulative distance <= currentDistance
          // Use binary search for O(log n) performance instead of O(n)
          let left = 0;
          let right = cumulativeDistances.length - 1;
          let lastIndex = 0;

          while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const dist = cumulativeDistances[mid];

            if (dist !== undefined && dist <= currentDistance) {
              lastIndex = mid;
              left = mid + 1;
            } else {
              right = mid - 1;
            }
          }

          // Build progress line using pre-calculated indices
          const progressPoints = routeData.slice(0, lastIndex + 1);

          // Update sources imperatively
          if (progressPoints.length >= 2) {
            const progressSource = map.getSource("route-source-progress");
            if (progressSource && progressSource.type === "geojson") {
              progressSource.setData(lineString(progressPoints));
            }
          }

          // Update position marker
          const positionSource = map.getSource("position-source");
          if (positionSource && positionSource.type === "geojson") {
            positionSource.setData({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coords,
              },
              properties: {},
            });
          }
        }
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;

    if (map.isStyleLoaded()) {
      unsubscribe = setupProgressUpdates();
    } else {
      map.once("load", () => {
        unsubscribe = setupProgressUpdates();
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [flyToDuration, followPathDuration, routeData]);

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

        {/* Progress route - updated imperatively, starts empty */}
        <Route
          id="progress"
          data={simplifiedRouteData.slice(0, 2)} // Initial data with first 2 points
          lineColor={progressColor ?? "#FFF"}
          lineWidth={2}
        />

        {/* Current position marker - updated imperatively */}
        <Position data={startPosition} color={progressColor ?? "#FFF"} />

        <AnimationController
          config={animationConfig}
          map={mapRef.current?.getMap() ?? null}
        />
      </MapGL>
    </div>
  );
}

export { MapGLAnimated };
