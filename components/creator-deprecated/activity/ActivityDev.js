import Map from "@/components/creator/map";
import Credits from "@/components/creator/credits";
import styles from "./activity.module.css";

export default function ActivityDev({ activity, activityData }) {
  return (
    <div className={styles.activity}>
      <h2 className={styles.activityTitleSkeleton}> </h2>
      <div className={styles.activityContentSkeleton}></div>
    </div>
  );
}
