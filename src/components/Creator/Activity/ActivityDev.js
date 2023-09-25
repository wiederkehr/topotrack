import Map from "@/components/Creator/Map";
import Credits from "@/components/Creator/Credits";
import styles from "./Activity.module.css";

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
