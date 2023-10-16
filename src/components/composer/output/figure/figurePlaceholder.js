import styles from "./figure.module.css";

export default function ActivityPlaceholder({ children }) {
  return <div className={styles.figurePlaceholder}>{children}</div>;
}
