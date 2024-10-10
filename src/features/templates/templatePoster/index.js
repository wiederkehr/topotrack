import { formatMeters } from "@/functions/format";
import { colors } from "@/styles/constants";

import Background from "./background";
import Foreground from "./foreground";

const name = "Poster";

const variables = [
  {
    label: "Background",
    name: "background",
    type: "color",
  },
  {
    label: "Foreground",
    name: "foreground",
    type: "color",
  },
];

const presets = [
  {
    name: "Indigo",
    background: colors.dark.indigo,
    foreground: colors.light.indigo,
  },
  {
    name: "Ruby",
    background: colors.dark.ruby,
    foreground: colors.light.ruby,
  },
  {
    name: "Teal",
    background: colors.dark.teal,
    foreground: colors.light.teal,
  },
];

const render = ({ activity, activityData, variables, format, size }) => {
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
  const elevation = formatMeters(activity?.total_elevation_gain);
  const { background, foreground } = variables;

  const { width, height } = size;
  return (
    <>
      <Background
        data={data}
        width={width}
        height={height}
        background={background}
        foreground={foreground}
      />
      <Foreground
        name={name}
        type={type}
        day={day}
        year={year}
        height={height}
        width={width}
        color={foreground}
        distance={distance}
        elevation={elevation}
      />
    </>
  );
};

export default {
  name,
  variables,
  presets,
  render,
};
