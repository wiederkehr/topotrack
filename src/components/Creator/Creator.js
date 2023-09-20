import { useState } from "react";
import { useStrava } from "@/hooks/useStrava";
import Activities, { ActivitiesPlaceholder } from "./Activities";
import Activity, { ActivityPlaceholder } from "./Activity";
import styles from "./Creator.module.css";

export default function Creator() {
  const [activity, setSelectedActivity] = useState();
  const { data, error, loading } = useStrava("athlete/activities");

  const findActivityById = (id) => {
    return data.find((activity) => activity.id.toString() === id.toString());
  };

  const renderActivities = () => {
    if (error) return <ActivitiesPlaceholder>Error!</ActivitiesPlaceholder>;
    if (loading) return <ActivitiesPlaceholder>Loading…</ActivitiesPlaceholder>;
    if (data && !activity) {
      setSelectedActivity(data[0].id);
    }
    return (
      <Activities
        activities={data}
        activity={activity}
        onSelectActivity={(id) => {
          setSelectedActivity(id);
        }}
      />
    );
  };

  const renderActivity = () => {
    if (!activity)
      return (
        <ActivityPlaceholder>
          Please select activity to get started.
        </ActivityPlaceholder>
      );
    return <Activity activity={findActivityById(activity)} />;
  };

  return (
    <div className={styles.creator}>
      <div className={styles.activities}>{renderActivities()}</div>
      <div className={styles.activity}>{renderActivity()}</div>
    </div>
  );
}
