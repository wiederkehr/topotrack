import { Heading } from "@radix-ui/themes";
import Link from "next/link";

import styles from "./logo.module.css";

export function Logo() {
  return (
    <Heading size="4" className={styles.logo}>
      <Link href="/">Topotrack</Link>
    </Heading>
  );
}
