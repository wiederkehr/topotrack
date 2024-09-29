import classNames from "classnames";
import styles from "./item.module.css";

export default function Item({ id, name, date, active, onClick }) {
  return (
    <button
      className={classNames(styles.item, active ? styles.itemActive : null)}
      onClick={() => onClick(id)}
    >
      <span className={styles.itemDate}>{date}</span>
      <span className={styles.itemName}>{name}</span>
    </button>
  );
}
