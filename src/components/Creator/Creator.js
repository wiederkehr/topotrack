import { useState } from "react";
import { useStrava } from "@/hooks/useStrava";
import Activities from "./Activities";
import Activity from "./Activity";
import ActivityPlaceholder from "./ActivityPlaceholder";
import styles from "./Creator.module.css";

export default function Creator() {
  const [activity, setSelectedActivity] = useState("");
  const { data, error } = useStrava("athlete/activities");

  if (error) return <div className={styles.creatorError}>Error!</div>;
  if (!data) return <div className={styles.creatorLoading}>Loading…</div>;

  const findActivityById = (id) => {
    return data.find((activity) => activity.id.toString() === id.toString());
  };

  return (
    <div className={styles.creator}>
      <div className={styles.activitesContainer}>
        <Activities
          activities={data}
          activity={activity}
          onSelectActivity={(id) => {
            setSelectedActivity(id);
          }}
        />
      </div>
      <div className={styles.activityContainer}>
        {activity ? (
          <Activity activity={findActivityById(activity)} />
        ) : (
          <ActivityPlaceholder>Select Activity.</ActivityPlaceholder>
        )}
      </div>
    </div>
  );
}
