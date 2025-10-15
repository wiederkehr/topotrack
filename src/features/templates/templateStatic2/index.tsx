import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import chroma from "chroma-js";
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  LucideProps,
  MapPin,
  Timer,
} from "lucide-react";

import { MapGLStatic } from "@/features/templates/components/mapGL";
import Route from "@/features/templates/components/mapGL/route";
import { mapStyle } from "@/features/templates/components/mapGL/styles/contours";
import { SVGContainer, SVGProfile } from "@/features/templates/components/svg";
import {
  destructureActivity,
  destructureActivityData,
  destructureVariables,
} from "@/functions/destructure";
import { colors } from "@/styles/constants";
import { PresetType, RenderType, VariableType } from "@/types";

import { Layer } from "../components/layer";
import styles from "./template.module.css";

// Name
// //////////////////////////////
const name = "Static 2.0";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  { label: "Foreground", name: "foreground", type: "color" },
  { label: "Middleground", name: "middleground", type: "color" },
  { label: "Background", name: "background", type: "color" },
];

// Presets
// //////////////////////////////
const presets: PresetType[] = [
  {
    name: "Indigo",
    foreground: colors.mono.white,
    middleground: colors.light.indigo,
    background: colors.dark.indigo,
  },
];

// Render
// //////////////////////////////
function Render({
  activity,
  activityData,
  variables,
  size,
  format,
}: RenderType) {
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    background = colors.dark.indigo,
  } = destructureVariables(variables);
  const { width } = size;
  const { lnglat, altitude, time } = destructureActivityData(activityData);
  const { name, distance, elevation, state, country, day, year } =
    destructureActivity(activity);

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
          <Profile
            color={middleground}
            width={profileWidth}
            height={profileHeight}
            data={altitude}
          />
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

// Subcomponents
// //////////////////////////////
const Profile = ({
  height,
  width,
  color,
  data,
}: {
  color: string;
  data: number[];
  height: number;
  width: number;
}) => (
  <Box mb="-14px">
    <SVGContainer width={width} height={height}>
      <SVGProfile
        data={data}
        height={height}
        width={width}
        strokeColor={color}
        strokeWidth={2}
        fillGradient={{
          startColor: chroma(color).alpha(0.4).hex(),
          endColor: chroma(color).alpha(0.0).hex(),
        }}
      />
    </SVGContainer>
  </Box>
);
const InfoBlock = ({
  padding,
  position,
  children,
}: {
  children: React.ReactNode;
  padding: { bottom: number; left: number; right: number; top: number };
  position: "top" | "bottom";
}) => {
  function toPixel(number: number): string {
    return number.toString() + "px";
  }
  return (
    <Box
      position={"absolute"}
      bottom={position === "bottom" ? toPixel(padding.bottom) : undefined}
      top={position === "top" ? toPixel(padding.top) : undefined}
      left={toPixel(padding.left)}
      right={toPixel(padding.right)}
    >
      {children}
    </Box>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => (
  <Heading className={styles.title}>{children}</Heading>
);
const MetaList = ({
  color,
  items,
}: {
  color: string;
  items: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    value: string;
  }[];
}) => (
  <Flex position="relative" align="center">
    <MetaDivider color={color} />
    <Flex
      direction="row"
      display="inline-flex"
      align="center"
      justify="center"
      gap="4"
      px="2"
      className={styles.metaList}
      style={{ color: color }}
    >
      {items.map((item, i) => (
        <MetaItem key={i} icon={item.icon}>
          {item.value}
        </MetaItem>
      ))}
    </Flex>
    <MetaDivider color={color} />
  </Flex>
);

const MetaDivider = ({ color }: { color: string }) => (
  <Box flexGrow="1" height="1px" style={{ backgroundColor: color }} />
);

const MetaItem = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) => (
  <Flex className={styles.metaItem} align="center" gap="2">
    <Icon size={16} />
    <Text className={styles.metaItem}>{children}</Text>
  </Flex>
);

// Export
// //////////////////////////////
const template = {
  name,
  variables,
  presets,
  Render,
};

export default template;
