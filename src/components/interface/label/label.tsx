import { ReactNode } from "react";

import styles from "./label.module.css";

type LabelProps = {
  children: ReactNode;
};

function Label({ children }: LabelProps) {
  return <span className={styles.label}>{children}</span>;
}

export default Label;
