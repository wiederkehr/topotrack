import { Content } from "@radix-ui/react-tabs";

import Scrollarea from "@/components/interface/scrollarea";

import styles from "./tab.module.css";

type TabProps = {
  children: React.ReactNode;
  name: string;
};

function Tab({ name, children }: TabProps) {
  return (
    <Content className={styles.tabContent} value={name}>
      <Scrollarea>{children}</Scrollarea>
    </Content>
  );
}

export default Tab;
export type { TabProps };
