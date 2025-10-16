import { Root as AspectRatio } from "@radix-ui/react-aspect-ratio";

import { FormatType } from "@/types";

import styles from "./canvas.module.css";

type CanvasProps = {
  children: React.ReactNode;
  format: FormatType;
};

export function Canvas({ format, children }: CanvasProps) {
  return (
    <div className={styles.canvas}>
      <AspectRatio
        className={styles.canvasAspectRatio}
        ratio={format.width && format.height ? format.width / format.height : 1}
      >
        {children}
      </AspectRatio>
    </div>
  );
}
export type { CanvasProps };
