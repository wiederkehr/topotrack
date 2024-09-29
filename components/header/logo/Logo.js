import { Heading } from "@radix-ui/themes";
import styles from "./logo.module.css";

export default function Logo() {
  return (
    <Heading size="4" className={styles.logo}>
      Topotrack
    </Heading>
  );
}
