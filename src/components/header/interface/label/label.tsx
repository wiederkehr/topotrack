import { ReactNode } from "react";

import styles from "./label.module.css";

type LabelProps = {
  children: ReactNode;
};

export function Label({ children }: LabelProps) {
  return <span className={styles.label}>{children}</span>;
}
