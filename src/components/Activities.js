import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import styles from "./Activities.module.css";

export default function Activities({ children }) {
  return (
    <div className={styles.activitiesContainer}>
      <select className={styles.activitiesSelect}>
        <option value="" disabled selected hidden>
          Select activity…
        </option>
        <option>Activity 1</option>
        <option>Activity 2</option>
        <option>Activity 3</option>
        <option>Activity 4</option>
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className={styles.activitiesSelectIcon}
      />
    </div>
  );
}
