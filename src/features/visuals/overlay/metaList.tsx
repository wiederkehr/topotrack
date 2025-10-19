import { Flex } from "@radix-ui/themes";
import { LucideProps } from "lucide-react";

import { MetaDivider } from "./metaDivider";
import { MetaItem } from "./metaItem";
import styles from "./overlay.module.css";

type MetaListProps = {
  color: string;
  items: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    value: string;
  }[];
};

export function MetaList({ color, items }: MetaListProps) {
  return (
    <Flex position="relative" align="center">
      <MetaDivider color={color} />
      <Flex
        direction="row"
        display="inline-flex"
        align="center"
        justify="center"
        gap="4"
        px="2"
        className={styles.metaList}
        style={{ color: color }}
      >
        {items.map((item) => (
          <MetaItem key={item.value} icon={item.icon}>
            {item.value}
          </MetaItem>
        ))}
      </Flex>
      <MetaDivider color={color} />
    </Flex>
  );
}
