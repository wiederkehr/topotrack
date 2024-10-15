import { Content } from "@radix-ui/react-tabs";
import { useMediaQuery } from "react-responsive";

import Scrollarea from "@/components/interface/scrollarea";

import styles from "./tab.module.css";

export default function Tab({ name, children }) {
  const isSM = useMediaQuery({ query: "(min-width: 768px)" });
  return (
    <Content className={styles.tabContent} value={name}>
      {!isSM && children}
      {isSM && <Scrollarea>{children}</Scrollarea>}
    </Content>
  );
}
