import styles from "./dimensionfields.module.css";

type DimensionfieldsProps = {
  height: number;
  width: number;
};

export function Dimensionfields({ width, height }: DimensionfieldsProps) {
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
export type { DimensionfieldsProps };
