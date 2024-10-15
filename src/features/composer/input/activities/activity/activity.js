import { Card, Text } from "@radix-ui/themes";

import styles from "./activity.module.css";

export default function Activity({ name, date, active, onClick }) {
  return (
    <Card asChild className={active ? styles.activityActive : undefined}>
      <button onClick={onClick}>
        <Text className={styles.activityDate}>{date}</Text>
        <Text className={styles.activityName}>{name}</Text>
      </button>
    </Card>
  );
}
