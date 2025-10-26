import { generateColorPresets } from "@/functions/presets";
import { OverrideType, VariableType } from "@/types";

import { Visual } from "./visual";

// Name
// //////////////////////////////
const name = "Animation 2.0";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
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
});

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
