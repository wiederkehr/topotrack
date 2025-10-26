import {
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
} from "@radix-ui/react-scroll-area";
import { ReactNode } from "react";

import styles from "./scrollarea.module.css";

type ScrollareaProps = {
  children: ReactNode;
};

export function Scrollarea({ children }: ScrollareaProps) {
  return (
    <div className={styles.scrollArea}>
      <Root className={styles.scrollAreaRoot}>
        <Viewport className={styles.scrollAreaViewport}>{children}</Viewport>
        <Scrollbar
          className={styles.scrollAreaScrollbar}
          orientation="horizontal"
        >
          <Thumb className={styles.scrollAreaThumb} />
        </Scrollbar>
        <Scrollbar
          className={styles.scrollAreaScrollbar}
          orientation="vertical"
        >
          <Thumb className={styles.scrollAreaThumb} />
        </Scrollbar>
        <Corner className={styles.scrollAreaCorner} />
      </Root>
    </div>
  );
}
