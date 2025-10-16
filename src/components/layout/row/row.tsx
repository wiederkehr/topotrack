import { Box } from "@radix-ui/themes";
import { ReactNode } from "react";

type RowProps = {
  children: ReactNode;
};

export function Row({ children }: RowProps) {
  return (
    <Box mx="auto" px="5">
      {children}
    </Box>
  );
}
