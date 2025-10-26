import { Button as RxButton } from "@radix-ui/themes";
import { MouseEventHandler, ReactNode } from "react";

import styles from "./button.module.css";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, onClick, disabled = false }: ButtonProps) {
  return (
    <RxButton
      size="3"
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </RxButton>
  );
}
