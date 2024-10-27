import { colors } from "@/styles/constants";
import { PresetType, RenderType, VariableType } from "@/types";

// Name
// //////////////////////////////
const name = "Debug";

// Variables
// //////////////////////////////
const variables: VariableType[] = [
  {
    label: "Foreground",
    name: "foreground",
    type: "color",
  },
  {
    label: "Background",
    name: "background",
    type: "color",
  },
];

// Presets
// //////////////////////////////
const presets: PresetType[] = [
  {
    name: "Debug Preset 1",
    foreground: colors.light.indigo,
    background: colors.dark.indigo,
  },
  {
    name: "Debug Preset 2",
    foreground: colors.light.teal,
    background: colors.dark.teal,
  },
];

function Render({
  activity,
  activityData,
  variables,
  format,
  size,
}: RenderType) {
  return (
    <div>
      <pre>{`Name: ${name}`}</pre>
      <pre>
        Variables:
        <code>{JSON.stringify(variables, null, 2)}</code>
      </pre>
    </div>
  );
}

export default {
  name,
  variables,
  presets,
  Render,
};
