import { Layer } from "@/features/templates/components/layer";
import { MapGLAnimated } from "@/features/templates/components/mapGL";
import {
  destructureActivityData,
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
const presets = generateColorPresets({
  foreground: "mono",
  middleground: "light",
  background: "dark",
}).map((preset) => ({ ...preset, map: "Dark" as string }));

// Render
// //////////////////////////////
function Render({ activityData, variables, format }: RenderType) {
  const {
    foreground = colors.mono.white,
    middleground = colors.light.indigo,
    map = mapOptions[0],
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
  const mapStyle = mapsStyles[map as keyof typeof mapsStyles];

  return (
    <>
      <Layer>
        <MapGLAnimated
          key={format.name}
          data={lnglat}
          padding={routePadding}
          style={mapStyle}
          routeColor={middleground}
          progressColor={foreground}
        />
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
