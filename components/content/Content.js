import styles from "./content.module.css";

export default function Content({ children }) {
  return <main className={styles.content}>{children}</main>;
}
