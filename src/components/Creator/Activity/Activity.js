import classNames from "classnames";
import { useStrava } from "@/hooks/useStrava";
import Map from "../Map/Map";
import styles from "./Activity.module.css";

export default function Activity({ activity }) {
  const { data, error } = useStrava(
    `activities/${activity.id}/streams?keys=[time,distance,latlng,altitude]`
  );
  const renderActivity = () => {
    if (error)
      return (
        <div className={classNames(styles.activity, styles.error)}>Error!</div>
      );
    if (!data)
      return (
        <div className={classNames(styles.activity, styles.loading)}>
          Loading…
        </div>
      );
    return (
      <div className={styles.activity}>
        <h2 className={styles.activityTitle}>{activity.name}</h2>
        <div className={styles.activityContent}>
          <Map data={data} />
        </div>
      </div>
    );
  };
  return renderActivity();
}
