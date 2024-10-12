import { Box } from "@radix-ui/themes";

export default function Row({ children }) {
  return (
    <Box mx="auto" px="5">
      {children}
    </Box>
  );
}
