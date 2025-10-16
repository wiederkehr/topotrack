import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

type ColumnProps = {
  children: ReactNode;
};

export function Column({ children }: ColumnProps) {
  return (
    <Flex direction="column" minHeight="100vh">
      {children}
    </Flex>
  );
}
