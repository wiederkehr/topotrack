import { Root as AspectRatio } from "@radix-ui/react-aspect-ratio";

import styles from "./canvas.module.css";

type CanvasProps = {
  children: React.ReactNode;
  format: {
    height: number;
    width: number;
  };
};

function Canvas({ format, children }: CanvasProps) {
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

export default Canvas;
export type { CanvasProps };
