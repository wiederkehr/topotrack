import { List, Root, Trigger } from "@radix-ui/react-tabs";

import styles from "./tabs.module.css";

type TabsProps = {
  children: React.ReactNode;
  names: string[];
};

export function Tabs({ names, children }: TabsProps) {
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
export type { TabsProps };
