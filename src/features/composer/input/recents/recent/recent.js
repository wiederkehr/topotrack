import { Card, Text } from "@radix-ui/themes";

import styles from "./recent.module.css";

export default function Recent({ name, date, active, onClick }) {
  return (
    <Card asChild className={active ? styles.itemActive : undefined}>
      <button onClick={onClick}>
        <Text className={styles.itemDate}>{date}</Text>
        <Text className={styles.itemName}>{name}</Text>
      </button>
    </Card>
  );
}
