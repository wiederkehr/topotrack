import Module from "@/components/interface/module";
import { formatDate } from "@/functions/format";

import Item from "./item";
import styles from "./recents.module.css";

export default function Recents({
  activities,
  activitiesError,
  activitiesLoading,
  selectedActivity,
  onActivityChange,
}) {
  if (!activities) return null;
  return (
    <Module label="Recent">
      <ul className={styles.recentsList}>
        {activities.map((activity, index) => (
          <li className={styles.recentsListItem} key={index}>
            <Item
              id={activity.id}
              name={activity.name}
              date={formatDate(activity.start_date_local)}
              active={activity.id === selectedActivity?.id}
              onClick={onActivityChange}
            />
          </li>
        ))}
      </ul>
    </Module>
  );
}
