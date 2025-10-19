import { Layer } from "@/features/visuals/layer";
import { MapGLAnimated } from "@/features/visuals/map";
import {
  MapShadeType,
  mapStyle,
  mapStyleOptions,
} from "@/features/visuals/map/styles/minimal";
import {
  destructureActivityData,
  destructureVariables,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";
import { VisualType } from "@/types";

// Visual
// //////////////////////////////
export function Visual({ activityData, variables, format }: VisualType) {
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    map = mapStyleOptions[0],
  } = destructureVariables(variables);
  const { lnglat } = destructureActivityData(activityData);

  const formatPadding: Record<string, { bottom: number; top: number }> = {
    Square: { top: 50, bottom: 50 },
    Portrait: { top: 50, bottom: 50 },
    Story: { top: 50, bottom: 50 },
    Landscape: { top: 50, bottom: 50 },
  };
  const padding = {
    top: 0,
    bottom: 0,
    left: 50,
    right: 50,
    ...formatPadding[format.name],
  };
  const headerHeight = 56;
  const headerToRouteGap = 20;
  const footerToRouteGap = 20;
  const footerHeight = 148;
  const routePadding = {
    top: padding.top + headerHeight + headerToRouteGap,
    bottom: padding.bottom + footerHeight + footerToRouteGap,
    left: 50,
    right: 50,
  };

  return (
    <>
      <Layer>
        <MapGLAnimated
          key={format.name}
          data={lnglat}
          padding={routePadding}
          style={mapStyle({ mapShade: map as MapShadeType })}
          routeColor={middleground}
          progressColor={foreground}
        />
      </Layer>
    </>
  );
}
