export const name = "Template B";

export const variables = [
  {
    label: "Theme",
    name: "theme",
    options: ["Light", "Dark"],
    type: "select",
  },
  {
    label: "Accent",
    name: "accent",
    options: ["Blue", "Green", "Purple", "White", "Red"],
    type: "color",
  },
  {
    label: "Animation",
    name: "animation",
    options: ["None", "Mild", "Wild"],
    type: "select",
  },
];

export const presets = [
  {
    name: "Template B.1",
    theme: "Light",
    accent: "Blue",
    animation: "Mild",
  },
  {
    name: "Template B.2",
    theme: "Dark",
    accent: "Red",
    animation: "Wild",
  },
];

export const Render = ({ activity, activityData, template, variables }) => {
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
