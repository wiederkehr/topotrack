import styles from "./column.module.css";

export default function Column({ children }) {
  return <div className={styles.column}>{children}</div>;
}
