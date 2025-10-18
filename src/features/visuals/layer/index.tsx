import { Box } from "@radix-ui/themes";
import { ReactNode } from "react";

type LayerProps = {
  children: ReactNode;
};

function Layer({ children }: LayerProps) {
  return (
    <Box position="absolute" width="100%" height="100%">
      {children}
    </Box>
  );
}

export { Layer };
