import { List, Root, Trigger } from "@radix-ui/react-tabs";

import styles from "./tabs.module.css";

export default function Tabs({ names, children }) {
  return (
    <Root className={styles.tabsRoot} defaultValue={names[0]}>
      <List className={styles.tabsList}>
        {names.map((item, index) => (
          <Trigger className={styles.tabsTrigger} value={item} key={index}>
            {item}
          </Trigger>
        ))}
      </List>
      {children}
    </Root>
  );
}
