import styles from "./row.module.css";

export default function Row({ children }) {
  return <div className={styles.row}>{children}</div>;
}
