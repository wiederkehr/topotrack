import { bbox, lineString } from "@turf/turf";
import chroma from "chroma-js";
import { LngLatBoundsLike } from "mapbox-gl";
import { useCallback, useRef } from "react";
import type { MapRef } from "react-map-gl";

import { Layer } from "@/features/visuals/layer";
import { Map } from "@/features/visuals/map";
import {
  calculateFollowBearing,
  mapAnimations,
} from "@/features/visuals/map/animations";
import { useAnimationController } from "@/features/visuals/map/animations";
import { Route } from "@/features/visuals/map/elements";
import { getContourColor } from "@/features/visuals/map/styles/getContourColor";
import { mapStyle } from "@/features/visuals/map/styles/terrain";
import { getPadding } from "@/features/visuals/padding";
import {
  destructureActivity,
  destructureActivityData,
  destructureVariables,
} from "@/functions/destructure";
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

  // Get map instance
  const mapInstance = mapRef.current?.getMap() ?? null;

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

  // Use animation controller to manage playback
  const animationSequence = buildAnimationSequence();
  useAnimationController(mapInstance, animationSequence, {
    center: startPosition,
    bearing: 0,
    pitch: 0,
  });

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
