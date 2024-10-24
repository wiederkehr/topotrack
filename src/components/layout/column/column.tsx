import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

type ColumnProps = {
  children: ReactNode;
};

function Column({ children }: ColumnProps) {
  return (
    <Flex direction="column" minHeight="100vh">
      {children}
    </Flex>
  );
}

export default Column;
