import styles from "./module.module.css";

export default function Module({ label, children }) {
  return (
    <div className={styles.module}>
      <div className={styles.moduleHeading}>{label}</div>
      <div className={styles.moduleContent}>{children}</div>
    </div>
  );
}

export function Submodule({ children }) {
  return <div className={styles.submodule}>{children}</div>;
}
