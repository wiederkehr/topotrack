import styles from "./Column.module.css";

export default function Column({ children }) {
  return <div className={styles.column}>{children}</div>;
}
