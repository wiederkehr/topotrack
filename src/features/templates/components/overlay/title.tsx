import { Heading } from "@radix-ui/themes";

import styles from "./overlay.module.css";

type TitleProps = {
  children: React.ReactNode;
};

export function Title({ children }: TitleProps) {
  return <Heading className={styles.title}>{children}</Heading>;
}
