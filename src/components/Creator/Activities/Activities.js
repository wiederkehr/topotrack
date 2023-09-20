import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import styles from "./Activities.module.css";

export default function Activities({ activities, activity, onSelectActivity }) {
  return (
    <div className={styles.activitiesContainer}>
      <select
        value={activity}
        onChange={(event) => onSelectActivity(event.target.value)}
        className={styles.activitiesSelect}
      >
        <option value="" disabled hidden>
          Select activity…
        </option>
        {activities.map((activity, i) => (
          <option key={i} value={activity.id}>
            {activity.name}
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        icon={faChevronDown}
        className={styles.activitiesSelectIcon}
      />
    </div>
  );
}
