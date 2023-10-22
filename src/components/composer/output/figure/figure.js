import { forwardRef } from "react";
import classNames from "classnames";
import { useStrava } from "@/hooks/useStrava";
import Map, { MapStatic } from "@/components/composer/output/map";
import styles from "./figure.module.css";

export default forwardRef(function Figure({ activity, activityData }, ref) {
  // FIXME: Switch from mock data to Strava data.
  const { data, error } = { data: activityData, error: undefined };
  // const { data, error } = useStrava(
  //   `activities/${activity.id}/streams?keys=[time,distance,latlng,altitude]`
  // );

  const figureLink = () => {
    const URLBase = "https://www.strava.com/activities/";
    return URLBase + activity?.id;
  };

  const renderFigure = () => {
    if (error)
      return (
        <div className={classNames(styles.figure, styles.error)}>Error!</div>
      );
    if (!data)
      return (
        <div className={classNames(styles.figure, styles.loading)}>
          Loading…
        </div>
      );
    return (
      <div className={styles.figure} ref={ref}>
        <div className={styles.figureBackground}>
          {/* <MapStatic data={data} /> */}
        </div>
        <div className={styles.figureForeground}>
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
            <FigureType level="primary">Elevation</FigureType>
          </div>
        </div>
      </div>
    );
  };
  return renderFigure();
});

const FigureType = ({ children, level }) => {
  return (
    <span
      className={classNames(
        styles.figureType,
        level === "primary" ? styles.figureTypePrimary : null,
        level === "secondary" ? styles.figureTypeSecondary : null
      )}
    >
      {children}
    </span>
  );
};
