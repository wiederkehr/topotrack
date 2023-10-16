import styles from "./dimensionfields.module.css";

export default function Dimensionfields({ width, height }) {
  return (
    <div className={styles.dimensionfields}>
      <div className={styles.dimensionfield}>
        <span className={styles.dimensionfieldLabel}>W</span>
        <span className={styles.dimensionfieldValue}>{width}</span>
      </div>
      <div className={styles.dimensionfield}>
        <span className={styles.dimensionfieldLabel}>H</span>
        <span className={styles.dimensionfieldValue}>{height}</span>
      </div>
    </div>
  );
}
