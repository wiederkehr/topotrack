import { Root } from "@radix-ui/react-aspect-ratio";
import styles from "./canvas.module.css";

export default function Canvas({ format, children }) {
  return (
    <div className={styles.canvas}>
      <Root ratio={format.width / format.height}>{children}</Root>
    </div>
  );
}
