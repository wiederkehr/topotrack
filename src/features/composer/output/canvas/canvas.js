import { Root as AspectRatio } from "@radix-ui/react-aspect-ratio";

import styles from "./canvas.module.css";

export default function Canvas({ format, children }) {
  return (
    <div className={styles.canvas}>
      <AspectRatio
        className={styles.canvasAspectRatio}
        ratio={format.width / format.height}
      >
        {children}
      </AspectRatio>
    </div>
  );
}
