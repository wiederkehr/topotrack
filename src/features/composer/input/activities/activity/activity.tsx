import { Card, Text } from "@radix-ui/themes";

import styles from "./activity.module.css";

type ActivityProps = {
  active: boolean;
  date: string;
  name: string;
  onClick: () => void;
};

function Activity({ name, date, active, onClick }: ActivityProps) {
  return (
    <Card asChild className={active ? styles.activityActive : undefined}>
      <button onClick={onClick}>
        <Text className={styles.activityDate}>{date}</Text>
        <Text className={styles.activityName}>{name}</Text>
      </button>
    </Card>
  );
}

export default Activity;
