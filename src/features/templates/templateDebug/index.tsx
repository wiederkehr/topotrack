const name = "Debug";

const foregroundOptions = ["Dark Blue", "Dark Green", "Dark Purple"];
const backgroundOptions = ["Light Blue", "Light Green", "Light Purple"];

type Variable = {
  label: string;
  name: string;
  options: string[];
  type: string;
};

const variables: Variable[] = [
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

type Preset = {
  background: string;
  foreground: string;
  name: string;
};

const presets: Preset[] = [
  {
    name: "Debug Preset 1",
    foreground: foregroundOptions[0],
    background: backgroundOptions[0],
  },
  {
    name: "Debug Preset 2",
    foreground: foregroundOptions[1],
    background: backgroundOptions[1],
  },
];

type RenderProps = {
  activity: any;
  activityData: any;
  format: string;
  size: string;
  variables: Variable[];
};

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
