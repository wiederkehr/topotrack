import { PresetType, RenderType, VariableType } from "@/types";

// Types
// //////////////////////////////
type VariablesType = {};

type RenderProps = RenderType & {
  variables: VariablesType;
};

// Name
// //////////////////////////////
const name = "";

// Variables
// //////////////////////////////
const variables: VariableType[] = [];

// Presets
// //////////////////////////////
const presets: PresetType[] = [];

// Render
// //////////////////////////////
const Render = ({
  activity,
  activityData,
  variables,
  format,
  size,
}: RenderProps) => {
  return null;
};

// Export
// //////////////////////////////
const template = {
  name,
  variables,
  presets,
  Render,
};

export default template;
