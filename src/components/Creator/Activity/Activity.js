import { useStrava } from "@/hooks/useStrava";
import styles from "./Activity.module.css";

export default function Activity({ activity }) {
  const { data, error } = useStrava(
    `activities/${activity.id}/streams?keys=[time,distance,latlng,altitude]`
  );
  if (error) return <div className={styles.activityError}>Error!</div>;
  if (!data) return <div className={styles.activityLoading}>Loading…</div>;
  console.log(data);
  return (
    <div className={styles.activity}>
      <h2 className={styles.activityTitle}>{activity.name}</h2>
      <div className={styles.activityContent}>Activity Content</div>
    </div>
  );
}
