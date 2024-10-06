import classNames from "classnames";

import { colors } from "@/styles/constants";

import styles from "./foreground.module.css";

const Foreground = ({
  name,
  type,
  day,
  year,
  distance,
  elevation,
  width,
  height,
}) => {
  return (
    <div className={styles.foreground}>
      <div className={styles.topLeft}>
        <ForegroundType level="primary">{name}</ForegroundType>
        <ForegroundType level="secondary">{type}</ForegroundType>
      </div>
      <div className={styles.topRight}>
        <ForegroundType level="primary">{day}</ForegroundType>
        <ForegroundType level="secondary">{year}</ForegroundType>
      </div>
      <div className={styles.bottomRight}>
        <ForegroundType level="primary">{distance}</ForegroundType>
        <ForegroundType level="secondary">{elevation}</ForegroundType>
      </div>
    </div>
  );
};

const ForegroundType = ({ children, level }) => {
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

export default Foreground;
