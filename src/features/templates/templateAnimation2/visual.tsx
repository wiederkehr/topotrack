import { bbox, lineString } from "@turf/turf";
import chroma from "chroma-js";
import { LngLatBoundsLike } from "mapbox-gl";
import { useEffect, useRef } from "react";
import type { MapRef } from "react-map-gl";

import { Layer } from "@/features/visuals/layer";
import { Map } from "@/features/visuals/map";
import {
  calculateFollowBearing,
  mapAnimations,
  playAnimation,
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
  const midPosition = lnglat[Math.round(lnglat.length / 2)] as [number, number];
  const mapRef = useRef<MapRef>(null);
  const mapKey = `${name} – ${format.name}`;
  const progressRouteID = "progressRoute";
  const progressPositionID = "progressPosition";

  // Store subscription for animation control
  const animationState = useTemplateStore((state) => state.animationState);
  const updateAnimationPosition = useTemplateStore(
    (state) => state.updateAnimationPosition,
  );

  // Animation on Map Load and Data Change
  // //////////////////////////////
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
    async function playMapAnimation() {
      try {
        // Calculate initial bearing for seamless transition from flyTo to followPath
        const lookAhead = 0.1;
        const initialBearing = calculateFollowBearing(
          startPosition,
          fullRoute,
          lookAhead,
        );

        // Example: Play a point animation
        // const animationPhase = mapAnimations.animatePoint({
        //   pointSourceId: progressPositionID,
        //   duration: 6000,
        //   route: fullRoute,
        // });
        // await playAnimation(map, animationPhase);
        // Example: Play a path animation
        // const animationPhase = mapAnimations.animatePath({
        //   lineSourceId: progressRouteID,
        //   duration: 6000,
        //   route: fullRoute,
        // });
        // await playAnimation(map, animationPhase);
        // Example: Play a route (path and point) animation
        // const animationSequence = mapAnimations.sequence(
        //   mapAnimations.wait(500),
        //   mapAnimations.animateRoute({
        //     lineSourceId: progressRouteID,
        //     pointSourceId: progressPositionID,
        //     duration: 6000,
        //     route: fullRoute,
        //   }),
        // );
        // await playAnimation(map, animationSequence);
        // Example: Play a single animation phase directly
        // const animationPhase = mapAnimations.flyTo({
        //   center: startPosition,
        //   duration: 2000,
        //   zoom: 16,
        // });
        // await playAnimation(map, animationPhase);
        // Example: Play a sequence of animation phases
        // Note: Uncomment the rotation example below to use 360-degree rotation instead of dynamic bearing
        // const rotationExample = mapAnimations.followPath({
        //   duration: 16000,
        //   route: fullRoute,
        //   bearingOptions: {
        //     type: "rotation",    // 360-degree rotation over animation duration
        //     bearing: 0,          // Starting bearing
        //     damping: 0.85,       // Optional: smooth the rotation (0.7-0.95)
        //   },
        // });

        const animationSequence = mapAnimations.sequence(
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
        await playAnimation(map, animationSequence);
      } catch (error) {
        console.error("Animation error:", error);
      }
    }

    // Trigger animation when map loads for the first time
    if (map.loaded()) {
      // Map already loaded, animation will be triggered by animationState effect below
    } else {
      map.once("idle", () => {
        // Map just loaded, animation will be triggered by animationState effect below
      });
    }
  }, [bounds, startPosition, midPosition, padding, lnglat, fullRoute]);

  // Handle animation state changes from Play/Stop buttons
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    if (!map.isStyleLoaded()) return;

    if (animationState === "playing") {
      console.log("[templateAnimation2] Starting animation from state change");
      const startPlayback = async () => {
        try {
          // Calculate initial bearing for seamless transition from flyTo to followPath
          const lookAhead = 0.1;
          const initialBearing = calculateFollowBearing(
            startPosition,
            fullRoute,
            lookAhead,
          );

          const animationSequence = mapAnimations.sequence(
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

          await playAnimation(map, animationSequence);
          console.log("[templateAnimation2] Animation completed naturally");
          updateAnimationPosition(0);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            console.log("[templateAnimation2] Animation was aborted");
            return;
          }
          console.error("Animation error:", error);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      startPlayback();
    }
  }, [
    animationState,
    startPosition,
    fullRoute,
    bounds,
    padding,
    progressRouteID,
    progressPositionID,
    updateAnimationPosition,
  ]);

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
