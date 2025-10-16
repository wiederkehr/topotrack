import { Button as RxButton } from "@radix-ui/themes";
import { MouseEventHandler, ReactNode } from "react";

import styles from "./button.module.css";

type ButtonProps = {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <RxButton size="3" className={styles.button} onClick={onClick}>
      {children}
    </RxButton>
  );
}
