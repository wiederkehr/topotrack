import { mapStyleOptions } from "@/features/visuals/map/styles/minimal";
import { generateColorPresets } from "@/functions/presets";
import { OverrideType, VariableType } from "@/types";

import { Visual } from "./visual";

// Name
// //////////////////////////////
const name = "Animation 2.0";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  {
    label: "Map",
    name: "map",
    options: mapStyleOptions,
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
  isAnimated: true,
};
