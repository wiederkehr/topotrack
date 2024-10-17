import { Content } from "@radix-ui/react-tabs";

import Scrollarea from "@/components/interface/scrollarea";

import styles from "./tab.module.css";

export default function Tab({ name, children }) {
  return (
    <Content className={styles.tabContent} value={name}>
      <Scrollarea>{children}</Scrollarea>
    </Content>
  );
}
