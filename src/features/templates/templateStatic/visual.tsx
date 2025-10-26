import { lineString } from "@turf/turf";
import chroma from "chroma-js";
import { ArrowRight, ArrowUp, Calendar, MapPin, Timer } from "lucide-react";

import { Layer } from "@/features/visuals/layer";
import { MapGLStatic } from "@/features/visuals/map";
import { Line } from "@/features/visuals/map/line";
import { mapStyle } from "@/features/visuals/map/styles/contours";
import { getContourColor } from "@/features/visuals/map/styles/getContourColor";
import { Overlay } from "@/features/visuals/overlay";
import {
  footerHeight,
  footerToRouteGap,
  headerHeight,
  headerToRouteGap,
} from "@/features/visuals/overlay/dimensions";
import { getPadding } from "@/features/visuals/padding";
import {
  destructureActivity,
  destructureActivityData,
  destructureOverrides,
  destructureVariables,
} from "@/functions/destructure";
import { formatTime } from "@/functions/format";
import { colors } from "@/styles/constants";
import { VisualType } from "@/types";

// Visual
// //////////////////////////////
export function Visual({
  activity,
  activityData,
  variables,
  overrides,
  size,
  format,
  units,
}: VisualType) {
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    background = colors.dark.indigo,
  } = destructureVariables(variables);
  const { name: nameOverride = "" } = destructureOverrides(overrides);
  const { width } = size;
  const { lnglat, altitude, time } = destructureActivityData(activityData);
  const {
    name: originalName,
    distance,
    elevation,
    state,
    country,
    day,
    year,
  } = destructureActivity(activity, units);
  const name = nameOverride || originalName;
  const routeForeground = chroma(foreground).mix(middleground, 0.2).hex();
  const routeBackground = chroma(middleground).mix(background, 0.6).hex();
  const contourColor = getContourColor(background);
  const formattedTime = formatTime(time[time.length - 1] || 0);
  const padding = getPadding(format.name);
  const routePadding = {
    top: padding.top + headerHeight + headerToRouteGap,
    bottom: padding.bottom + footerHeight + footerToRouteGap,
    left: 50,
    right: 50,
  };
  return (
    <>
      <Layer>
        <MapGLStatic
          key={format.name}
          data={lnglat}
          padding={routePadding}
          mapStyle={mapStyle({
            contourColor: contourColor,
            backgroundColor: background,
          })}
        >
          <Line
            id="background"
            data={lineString(lnglat)}
            lineColor={routeBackground}
            lineWidth={16}
          />
          <Line
            id="foreground"
            data={lineString(lnglat)}
            lineColor={routeForeground}
            lineWidth={2}
          />
        </MapGLStatic>
      </Layer>
      <Layer>
        <Overlay
          background={background}
          middleground={middleground}
          format={format.name}
          title={name}
          footerItems={[
            { value: distance, icon: ArrowRight },
            { value: elevation, icon: ArrowUp },
            { value: formattedTime, icon: Timer },
          ]}
          headerItems={[
            { value: day + ", " + year, icon: Calendar },
            { value: state + ", " + country, icon: MapPin },
          ]}
          width={width}
          profileData={altitude}
        />
      </Layer>
    </>
  );
}
