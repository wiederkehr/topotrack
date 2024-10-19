const name = "Debug";

const foregroundOptions = ["Dark Blue", "Dark Green", "Dark Purple"];
const backgroundOptions = ["Light Blue", "Light Green", "Light Purple"];

const variables = [
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

const presets = [
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

const Render = ({ activity, activityData, variables, format, size }) => {
  return (
    <div>
      <pre>{`Name: ${name}`}</pre>
      <pre>
        Variables:
        <code>{JSON.stringify(variables, null, 2)}</code>
      </pre>
    </div>
  );
};

export default {
  name,
  variables,
  presets,
  Render,
};
