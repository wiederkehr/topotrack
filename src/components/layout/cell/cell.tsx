import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

type CellProps = {
  children: ReactNode;
};

export function Cell({ children }: CellProps) {
  return (
    <Flex direction="column" minHeight={{ initial: "100vh" }}>
      {children}
    </Flex>
  );
}
