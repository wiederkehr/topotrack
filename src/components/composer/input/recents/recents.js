import Module from "@/components/composer/interface/module";
import Item from "./item";
import styles from "./recents.module.css";

export default function Recents({
  selectedActivity,
  activities,
  onActivityChange,
}) {
  return (
    <Module label="Recent">
      <ul className={styles.recentsList}>
        {activities.map((activity, index) => (
          <li className={styles.recentsListItem} key={index}>
            <Item
              id={activity.id}
              name={activity.name}
              date={activity.date}
              active={activity.id === selectedActivity.id}
              onClick={onActivityChange}
            />
          </li>
        ))}
      </ul>
    </Module>
  );
}
