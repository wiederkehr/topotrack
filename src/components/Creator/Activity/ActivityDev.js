import Map from "@/components/creator/map";
import Credits from "@/components/creator/credits";
import styles from "./activity.module.css";

export default function ActivityDev({ activity, activityData }) {
  return (
    <div className={styles.activity}>
      <h2 className={styles.activityTitle}>{activity.name}</h2>
      <div className={styles.activityContent}>
        <Map data={activityData} />
        <Credits />
      </div>
    </div>
  );
}
