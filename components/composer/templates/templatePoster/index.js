import { formatMeters } from "@/functions/format";

import Background from "./background";
import Foreground from "./foreground";

export const name = "Poster";

const themeOptions = ["Light", "Dark"];
const accentOptions = ["Blue", "Green", "Purple", "White", "Red"];

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
];

export const presets = [
  {
    name: "Poster Preset 1",
    theme: themeOptions[0],
    accent: "Blue",
  },
  {
    name: "Poster Preset 2",
    theme: themeOptions[1],
    accent: accentOptions[1],
  },
];

export const render = ({ activity, activityData, variables, format, size }) => {
  const data = activityData[0]?.data;
  const date = new Date(Date.parse(activity?.start_date_local));
  const day = date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
  });
  const year = date.toLocaleDateString("en-us", { year: "numeric" });
  const name = activity?.name;
  const type = activity?.type;
  const distance = formatMeters(activity?.distance);
  const elevation = activity?.total_elevation_gain;
  const { width, height } = size;
  return (
    <>
      <Background data={data} width={width} height={height} />
      <Foreground
        name={name}
        type={type}
        day={day}
        year={year}
        height={height}
        width={width}
        distance={distance}
        elevation={elevation}
      />
    </>
  );
};
