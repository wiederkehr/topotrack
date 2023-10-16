import { Button as RadixButton } from "@radix-ui/themes";
import styles from "./button.module.css";

export default function Button({ children, onClick }) {
  return (
    <RadixButton size="3" className={styles.button} onClick={onClick}>
      {children}
    </RadixButton>
  );
}
