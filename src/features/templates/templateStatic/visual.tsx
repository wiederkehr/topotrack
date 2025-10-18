import { Box } from "@radix-ui/themes";
import chroma from "chroma-js";
import { ArrowRight, ArrowUp, Calendar, MapPin, Timer } from "lucide-react";

import { MapGLStatic } from "@/features/visuals/mapGL";
import { Route } from "@/features/visuals/mapGL/route";
import { mapStyle } from "@/features/visuals/mapGL/styles/contours";
import {
  destructureActivity,
  destructureActivityData,
  destructureOverrides,
  destructureVariables,
} from "@/functions/destructure";
import { formatTime } from "@/functions/format";
import { colors } from "@/styles/constants";
import { VisualType } from "@/types";

import { Layer } from "../../visuals/layer";
import { InfoBlock, MetaList, Profile, Title } from "../../visuals/overlay";

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

  // Use override if provided, otherwise use original value
  const name = nameOverride || originalName;

  const routeForeground = chroma(foreground).mix(middleground, 0.2).hex();
  const routeBackground = chroma(middleground).mix(background, 0.6).hex();

  function getContourColor(color: string = "#fff"): string {
    const colorLuminance = chroma(color).luminance();
    if (colorLuminance <= 0.5) {
      return chroma(color).brighten(0.4).hex();
    } else {
      return chroma(color).darken(0.4).hex();
    }
  }

  const contourColor = getContourColor(background);

  const formattedTime = formatTime(time[time.length - 1] || 0);

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
  const profileWidth = width - padding.left - padding.right;
  const profileHeight = 120;
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
  const headerOverlayHeight = padding.top + headerHeight + headerToRouteGap;
  const footerOverlayHeight = padding.bottom + footerHeight + footerToRouteGap;
  return (
    <>
      <Layer>
        <MapGLStatic
          key={format.name}
          data={lnglat}
          padding={routePadding}
          mapStyle={mapStyle({
            lineColor: contourColor,
            backgroundColor: background,
          })}
        >
          <Route data={lnglat} lineColor={routeBackground} lineWidth={16} />
          <Route data={lnglat} lineColor={routeForeground} lineWidth={2} />
        </MapGLStatic>
      </Layer>
      <Layer>
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height={headerOverlayHeight + "px"}
          style={{
            background: `linear-gradient(${chroma(background).alpha(1).css()} 66%, ${chroma(background).alpha(0).css()} 100%)`,
          }}
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height={footerOverlayHeight + "px"}
          style={{
            background: `linear-gradient(${chroma(background).alpha(0).css()} 0%, ${chroma(background).alpha(1).css()} 33%)`,
          }}
        />
      </Layer>
      <Layer>
        <InfoBlock position="top" padding={padding}>
          <Title>{name}</Title>
          <MetaList
            color={middleground}
            items={[
              { value: day + ", " + year, icon: Calendar },
              { value: state + ", " + country, icon: MapPin },
            ]}
          />
        </InfoBlock>
        <InfoBlock position="bottom" padding={padding}>
          <Box mb="-14px">
            <Profile
              color={middleground}
              width={profileWidth}
              height={profileHeight}
              data={altitude}
            />
          </Box>
          <MetaList
            color={middleground}
            items={[
              { value: distance, icon: ArrowRight },
              { value: elevation, icon: ArrowUp },
              { value: formattedTime, icon: Timer },
            ]}
          />
        </InfoBlock>
      </Layer>
    </>
  );
}
