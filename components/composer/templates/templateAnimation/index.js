export const name = "Animation";

const themeOptions = ["Light", "Dark"];
const accentOptions = ["Blue", "Green", "Purple", "White", "Red"];
const animationOptions = ["None", "Mild", "Wild"];

export const variables = [
  {
    label: "Theme",
    name: "theme",
    options: themeOptions,
    type: "select",
  },
  {
    label: "Accent",
    name: "accent",
    options: accentOptions,
    type: "color",
  },
  {
    label: "Animation",
    name: "animation",
    options: animationOptions,
    type: "select",
  },
];

export const presets = [
  {
    name: "Animation Preset 1",
    theme: themeOptions[0],
    accent: accentOptions[0],
    animation: animationOptions[0],
  },
  {
    name: "Animation Preset 2",
    theme: themeOptions[1],
    accent: accentOptions[1],
    animation: animationOptions[1],
  },
];

export const render = ({ activity, activityData, variables }) => {
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
