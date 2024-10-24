import { RenderBaseProps, VariableType } from "@/features/templates/types";

// Types
// //////////////////////////////
type VariablesType = {};

type PresetType = VariablesType & {
  name: string;
};

type RenderProps = RenderBaseProps & {
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
