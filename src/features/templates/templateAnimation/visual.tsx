import { bbox, lineString } from "@turf/turf";
import chroma from "chroma-js";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";
import type { MapRef } from "react-map-gl";

import { Layer } from "@/features/visuals/layer";
import { Map } from "@/features/visuals/map";
import {
  calculateFollowBearing,
  mapAnimations,
} from "@/features/visuals/map/animations";
import { Route } from "@/features/visuals/map/elements";
import { getContourColor } from "@/features/visuals/map/styles/getContourColor";
import { mapStyle } from "@/features/visuals/map/styles/terrain";
import { getPadding } from "@/features/visuals/padding";
import {
  destructureActivity,
  destructureActivityData,
  destructureVariables,
} from "@/functions/destructure";
import { useAnimationController } from "@/hooks/useAnimationController";
import { useTemplateStore } from "@/stores";
import { colors } from "@/styles/constants";
import { VisualType } from "@/types";

// Visual
// //////////////////////////////
export function Visual({
  activity,
  activityData,
  variables,
  format,
  units,
}: VisualType) {
  // Attributes
  // //////////////////////////////
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    background = colors.dark.indigo,
  } = destructureVariables(variables);
  const { lnglat } = destructureActivityData(activityData);
  const { name } = destructureActivity(activity, units);
  // Layout
  // //////////////////////////////
  const padding = getPadding(format.name);
  // Colors
  // //////////////////////////////
  const routeForeground = chroma(foreground).mix(middleground, 0.2).hex();
  const routeBackground = chroma(middleground).mix(background, 0.6).hex();
  const contourColor = getContourColor(background);
  // Map
  // //////////////////////////////
  const pitch = 0;
  const bearing = 0;
  const bounds = bbox(lineString(lnglat)) as LngLatBoundsLike;
  const fullRoute = lnglat;
  const progressRoute = lnglat.slice(0, 2);
  const startPosition = lnglat[0] as [number, number];
  const mapRef = useRef<MapRef>(null);
  const mapKey = `${name} – ${format.name}`;
  const progressRouteID = "progressRoute";
  const progressPositionID = "progressPosition";

  // Get map instance for animation controller
  const mapInstance = mapRef.current?.getMap() ?? null;
  const { play: playAnimation, stop: stopAnimation } =
    useAnimationController(mapInstance);

  // Create animation sequence builder
  const buildAnimationSequence = useCallback(() => {
    const lookAhead = 0.1;
    const initialBearing = calculateFollowBearing(
      startPosition,
      fullRoute,
      lookAhead,
    );

    return mapAnimations.sequence(
      mapAnimations.wait(500),
      mapAnimations.flyTo({
        center: startPosition,
        duration: 2000,
        zoom: 13,
        pitch: 40,
        bearing: initialBearing,
      }),
      mapAnimations.wait(500),
      mapAnimations.sync(
        mapAnimations.animateRoute({
          lineSourceId: progressRouteID,
          pointSourceId: progressPositionID,
          duration: 16000,
          route: fullRoute,
        }),
        mapAnimations.followPath({
          duration: 16000,
          route: fullRoute,
          bearingOptions: {
            type: "dynamic",
            bearing: initialBearing,
            damping: 1,
            lookAhead: lookAhead,
          },
        }),
      ),
      mapAnimations.wait(500),
      mapAnimations.fitBounds({
        bounds: bounds,
        duration: 2000,
        padding: padding ?? undefined,
      }),
    );
  }, [
    startPosition,
    fullRoute,
    bounds,
    padding,
    progressRouteID,
    progressPositionID,
  ]);

  // Store the async play handler in a ref so buttons can access it
  const playHandlerRef = useRef<(() => Promise<void>) | null>(null);

  // Create play handler
  useEffect(() => {
    playHandlerRef.current = async () => {
      console.log("[templateAnimation] Play button clicked");
      if (!mapRef.current) return;

      const animationSequence = buildAnimationSequence();

      try {
        await playAnimation(animationSequence, (elapsedTime: number) => {
          console.log(
            `[templateAnimation] Animation progress: ${elapsedTime}ms`,
          );
        });
        console.log("[templateAnimation] Animation completed naturally");
        // Reset animation state when animation completes
        useTemplateStore.setState({ animationState: "stopped" });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("[templateAnimation] Animation was aborted");
          // Reset camera to start position
          if (mapRef.current) {
            const map = mapRef.current.getMap();
            map.easeTo({
              center: startPosition,
              duration: 0,
              bearing: 0,
              pitch: 0,
            });
          }
          // Make sure state is set to stopped
          useTemplateStore.setState({ animationState: "stopped" });
          return;
        }
        console.error("Animation error:", error);
      }
    };
  }, [buildAnimationSequence, playAnimation, startPosition]);

  // Register synchronous wrappers with store for buttons to call
  useEffect(() => {
    useTemplateStore.setState({
      playAnimation: () => {
        // Set state to playing first
        useTemplateStore.setState({ animationState: "playing" });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        playHandlerRef.current?.();
      },
      resetAnimation: () => {
        console.log("[templateAnimation] Stop button clicked");
        stopAnimation();
      },
    });
  }, [stopAnimation]);

  return (
    <Layer>
      <Map
        ref={mapRef}
        key={mapKey}
        bounds={bounds}
        padding={padding}
        mapConfig={{
          bearing: bearing,
          pitch: pitch,
        }}
        mapStyle={mapStyle({
          contourColor: contourColor,
          backgroundColor: background,
          hillshadeExaggeration: 0.25,
        })}
      >
        <Route
          data={fullRoute}
          line={{ lineColor: routeBackground, lineWidth: 8 }}
        />
        <Route
          data={progressRoute}
          line={{
            id: progressRouteID,
            lineColor: routeForeground,
            lineWidth: 2,
          }}
          start={{
            id: progressPositionID,
            circleRadius: 4,
            strokeWidth: 2,
            circleColor: routeForeground,
            strokeColor: routeBackground,
          }}
        />
      </Map>
    </Layer>
  );
}
