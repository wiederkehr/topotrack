import classNames from "classnames";
import styles from "./index.module.css";

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

export const render = ({ activity, activityData, variables }) => {
  return (
    <>
      <div className={styles.background}>{/* <MapStatic data={data} /> */}</div>
      <div className={styles.foreground}>
        <div className={styles.topLeft}>
          <FigureType level="primary">Name</FigureType>
          <FigureType level="secondary">Type</FigureType>
        </div>
        <div className={styles.topRight}>
          <FigureType level="primary">Date</FigureType>
          <FigureType level="secondary">Year</FigureType>
        </div>
        <div className={styles.bottomLeft}>
          <FigureType level="primary">Placeholder</FigureType>
          <FigureType level="secondary">Placeholder</FigureType>
        </div>
        <div className={styles.bottomRight}>
          <FigureType level="primary">Distance</FigureType>
          <FigureType level="secondary">Elevation</FigureType>
        </div>
      </div>
    </>
  );
};

const FigureType = ({ children, level }) => {
  return (
    <span
      className={classNames(
        styles.type,
        level === "primary" ? styles.typePrimary : null,
        level === "secondary" ? styles.typeSecondary : null
      )}
    >
      {children}
    </span>
  );
};
