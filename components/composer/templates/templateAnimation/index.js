import classNames from "classnames";

import { formatMeters } from "@/functions/format";
import { colors } from "@/styles/constants";
import { MapAnimated } from "@/components/map";

import styles from "./index.module.css";

export const name = "Animation";

const themeOptions = ["Light", "Dark"];
const accentOptions = ["Blue", "Green", "Purple", "White", "Red"];
const mapsStyles = {
  Light: "mapbox://styles/benjaminwiederkehr/clmzlvsu3023i01r81cc979q5",
  Dark: "mapbox://styles/benjaminwiederkehr/cm1o1o9zc00mv01qt0689hvjp",
};

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
    name: "Animation Preset 1",
    theme: themeOptions[0],
    accent: accentOptions[0],
  },
  {
    name: "Animation Preset 2",
    theme: themeOptions[1],
    accent: accentOptions[1],
  },
];

export const render = ({ activity, activityData, variables, format, size }) => {
  const name = activity?.name;
  const type = activity?.type;
  const distance = formatMeters(activity?.distance);
  const elevation = formatMeters(activity?.total_elevation_gain);
  const date = new Date(Date.parse(activity?.start_date_local));
  const day = date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
  });
  const year = date.toLocaleDateString("en-us", { year: "numeric" });
  return (
    <>
      <div className={styles.background}>
        <MapAnimated
          data={activityData}
          style={mapsStyles[variables.theme]}
          accent={colors.accent}
        />
      </div>
      <div className={styles.foreground}>
        <div className={styles.topLeft}>
          <FigureType level="primary">{name}</FigureType>
          <FigureType level="secondary">{type}</FigureType>
        </div>
        <div className={styles.topRight}>
          <FigureType level="primary">{day}</FigureType>
          <FigureType level="secondary">{year}</FigureType>
        </div>
        <div className={styles.bottomRight}>
          <FigureType level="primary">{distance}</FigureType>
          <FigureType level="secondary">{elevation}</FigureType>
        </div>
      </div>
    </>
  );
};

const FigureType = ({ children, level }) => {
  return (
    <span
      style={{ color: colors.accent }}
      className={classNames(
        styles.type,
        level === "primary" ? styles.typePrimary : null,
        level === "secondary" ? styles.typeSecondary : null,
      )}
    >
      {children}
    </span>
  );
};
