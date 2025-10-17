import { Flex, Text } from "@radix-ui/themes";
import { LucideProps } from "lucide-react";

import styles from "./overlay.module.css";

type MetaItemProps = {
  children: React.ReactNode;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export function MetaItem({ children, icon: Icon }: MetaItemProps) {
  return (
    <Flex className={styles.metaItem} align="center" gap="2">
      <Icon size={16} />
      <Text className={styles.metaItem}>{children}</Text>
    </Flex>
  );
}
