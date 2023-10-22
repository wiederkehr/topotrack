import {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
} from "@radix-ui/react-scroll-area";
import styles from "./scrollarea.module.css";

export default function Scrollarea({ children }) {
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
