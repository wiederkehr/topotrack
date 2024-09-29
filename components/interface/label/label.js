import styles from "./label.module.css";

export default function Label({ children }) {
  return <span className={styles.label}>{children}</span>;
}
