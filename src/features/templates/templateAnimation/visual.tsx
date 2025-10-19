import { Layer } from "@/features/visuals/layer";
import { MapGLAnimated } from "@/features/visuals/map";
import {
  MapShadeType,
  mapStyle,
  mapStyleOptions,
} from "@/features/visuals/map/styles/minimal";
import { getPadding } from "@/features/visuals/padding";
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
  const padding = getPadding(format.name);
  return (
    <Layer>
      <MapGLAnimated
        key={format.name}
        data={lnglat}
        padding={padding}
        style={mapStyle({ mapShade: map as MapShadeType })}
        routeColor={middleground}
        progressColor={foreground}
      />
    </Layer>
  );
}
