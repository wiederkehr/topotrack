import { generateColorPresets } from "@/functions/presets";
import { OverrideType, VariableType } from "@/types";

import { Visual } from "./visual";

// Name
// //////////////////////////////
const name = "Animation 2.0";

// Variables
// //////////////////////////////
export const mapOptions: string[] = ["Light", "Dark"];
export const mapsStyles: { Dark: string; Light: string } = {
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

// Export
// //////////////////////////////
export const templateAnimation = {
  name,
  variables,
  overrides,
  presets,
  Visual,
};
