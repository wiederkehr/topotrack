import { Button as RxButton } from "@radix-ui/themes";

import styles from "./button.module.css";

export default function Button({ children, onClick }) {
  return (
    <RxButton size="3" className={styles.button} onClick={onClick}>
      {children}
    </RxButton>
  );
}
