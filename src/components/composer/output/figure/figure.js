import Link from "next/link";
import classNames from "classnames";
import { useStrava } from "@/hooks/useStrava";
import Map from "@/components/composer/output/map";
import Credits from "@/components/composer/output/credits";
import styles from "./figure.module.css";

export default function Figure({ activity }) {
  const { data, error } = useStrava(
    `activities/${activity.id}/streams?keys=[time,distance,latlng,altitude]`
  );

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
      <div className={styles.figure}>
        <h2 className={styles.figureTitle}>{activity.name}</h2>
        <div className={styles.figureContent}>
          <Map data={data} />
          <Credits />
        </div>
        <p className={styles.figureSource}>
          <Link
            href={figureLink()}
            target="_blank"
            className={styles.figureSourceLink}
          >
            View on Strava
          </Link>
        </p>
      </div>
    );
  };
  return renderFigure();
}
