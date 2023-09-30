import styles from "./activities.module.css";

export default function ActivitiesPlaceholder({ children }) {
  return <div className={styles.activitiesPlaceholder}>{children}</div>;
}
