import styles from "./Activity.module.css";

export default function ActivityPlaceholder({ children }) {
  return <div className={styles.activityPlaceholder}>{children}</div>;
}
