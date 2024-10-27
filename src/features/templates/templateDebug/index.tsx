import { PresetType, RenderType, VariableType } from "@/types";

// Types
// //////////////////////////////
type VariablesType = {
  background: string;
  foreground: string;
};

type RenderProps = RenderType & {
  variables: VariablesType;
};

// Name
// //////////////////////////////
const name = "Debug";

// Variables
// //////////////////////////////
const foregroundOptions: string[] = ["Dark Blue", "Dark Green", "Dark Purple"];
const backgroundOptions: string[] = [
  "Light Blue",
  "Light Green",
  "Light Purple",
];
const variables: VariableType[] = [
  {
    label: "Foreground",
    name: "foreground",
    type: "color",
    options: foregroundOptions,
  },
  {
    label: "Background",
    name: "background",
    type: "color",
    options: backgroundOptions,
  },
];

// Presets
// //////////////////////////////
const presets: PresetType[] = [
  {
    name: "Debug Preset 1",
    foreground: foregroundOptions[0]!,
    background: backgroundOptions[0]!,
  },
  {
    name: "Debug Preset 2",
    foreground: foregroundOptions[1]!,
    background: backgroundOptions[1]!,
  },
];

function Render({
  activity,
  activityData,
  variables,
  format,
  size,
}: RenderProps) {
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
