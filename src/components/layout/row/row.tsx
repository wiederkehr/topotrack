import { Box } from "@radix-ui/themes";
import { ReactNode } from "react";

type RowProps = {
  children: ReactNode;
};

function Row({ children }: RowProps) {
  return (
    <Box mx="auto" px="5">
      {children}
    </Box>
  );
}

export default Row;
