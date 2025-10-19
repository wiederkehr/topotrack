// Skip all tsx linting rules
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { OverrideType, PresetType, VariableType } from "@/types";

import { Visual } from "./visual";

// Name
// //////////////////////////////
const name = "";

// Overrides
// //////////////////////////////
const overrides: OverrideType[] = [];

// Variables
// //////////////////////////////
const variables: VariableType[] = [];

// Presets
// //////////////////////////////
const presets: PresetType[] = [];

// Export
// //////////////////////////////
export const templateName = {
  name,
  overrides,
  variables,
  presets,
  Visual,
};
