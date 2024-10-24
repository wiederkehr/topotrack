import { ReactNode } from "react";

import styles from "./content.module.css";

type ContentProps = {
  children: ReactNode;
};

function Content({ children }: ContentProps) {
  return <main className={styles.content}>{children}</main>;
}

export default Content;
