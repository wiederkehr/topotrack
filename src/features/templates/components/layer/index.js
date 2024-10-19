import { Box } from "@radix-ui/themes";

export const Layer = ({ children }) => (
  <Box position="absolute" width="100%" height="100%">
    {children}
  </Box>
);
