import { Box } from "@radix-ui/themes";
import chroma from "chroma-js";
import { ArrowRight, ArrowUp, Calendar, MapPin, Timer } from "lucide-react";

import { Layer } from "@/features/templates/components/layer";
import { MapGLAnimated } from "@/features/templates/components/mapGL";
import {
  InfoBlock,
  MetaList,
  Profile,
  Title,
} from "@/features/templates/components/overlay";
import {
  destructureActivity,
  destructureActivityData,
  destructureOverrides,
  destructureVariables,
} from "@/functions/destructure";
import { generateColorPresets } from "@/functions/presets";
import { colors } from "@/styles/constants";
import { OverrideType, RenderType, VariableType } from "@/types";

// Name
// //////////////////////////////
const name = "Animation 2.0";

// Variables
// //////////////////////////////
const mapOptions: string[] = ["Light", "Dark"];
const mapsStyles: { Dark: string; Light: string } = {
  Light: "mapbox://styles/benjaminwiederkehr/clmzlvsu3023i01r81cc979q5",
  Dark: "mapbox://styles/benjaminwiederkehr/cm1o1o9zc00mv01qt0689hvjp",
};

const variables: VariableType[] = [
  {
    label: "Map",
    name: "map",
    options: mapOptions,
    type: "select",
  },
  { label: "Foreground", name: "foreground", type: "color" },
  { label: "Middleground", name: "middleground", type: "color" },
  { label: "Background", name: "background", type: "color" },
];

// Overrides
// //////////////////////////////
const overrides: OverrideType[] = [{ label: "Title", name: "name" }];

// Presets
// //////////////////////////////
const lightPresets = generateColorPresets({
  foreground: "mono",
  middleground: "light",
  background: "dark",
}).map((preset) => ({ ...preset, map: "Light" as string }));

const darkPresets = generateColorPresets({
  foreground: "mono",
  middleground: "light",
  background: "dark",
}).map((preset) => ({ ...preset, map: "Dark" as string }));

// Use first 12 light and first 12 dark to create 24 total presets
const presets = [...lightPresets.slice(0, 12), ...darkPresets.slice(0, 12)];

// Render
// //////////////////////////////
function Render({
  activity,
  activityData,
  variables,
  overrides,
  size,
  format,
  units,
}: RenderType) {
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    background = colors.dark.indigo,
    map = mapOptions[0],
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
  const activityName = nameOverride || originalName;

  // Time formatting helper
  function formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];

    // Show days only if >= 24 hours
    if (seconds >= 86400) {
      parts.push(days.toString().padStart(2, "0"));
    }

    // Show hours only if >= 60 minutes
    if (seconds >= 3600) {
      parts.push(hours.toString().padStart(2, "0"));
    }

    // Always show minutes and seconds
    parts.push(minutes.toString().padStart(2, "0"));
    parts.push(secs.toString().padStart(2, "0"));

    return parts.join(":");
  }

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
  const headerOverlayHeight = padding.top + headerHeight + headerToRouteGap;
  const footerOverlayHeight = padding.bottom + footerHeight + footerToRouteGap;
  const mapStyle = mapsStyles[map as keyof typeof mapsStyles];

  return (
    <>
      <Layer>
        <MapGLAnimated
          key={format.name}
          data={lnglat}
          style={mapStyle}
          accent={middleground}
          contrast={foreground}
          format={format}
        />
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
          <Title>{activityName}</Title>
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

// Export
// //////////////////////////////
const template = {
  name,
  variables,
  overrides,
  presets,
  Render,
};

export default template;
