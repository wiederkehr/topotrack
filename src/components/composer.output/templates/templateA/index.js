export const name = "Template A";

export const variables = [
  {
    label: "Foreground",
    name: "foreground",
    type: "color",
    options: ["Dark Blue", "Dark Green", "Dark Purple"],
  },
  {
    label: "Background",
    name: "background",
    type: "color",
    options: ["Light Blue", "Light Green", "Light Purple"],
  },
];

export const presets = [
  {
    name: "Template A.1",
    foreground: "Dark Blue",
    background: "Light Blue",
  },
  {
    name: "Template A.2",
    foreground: "Dark Green",
    background: "Light Green",
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
