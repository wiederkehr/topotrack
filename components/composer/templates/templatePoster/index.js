import classNames from "classnames";
import styles from "./index.module.css";

export const name = "Poster";

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
