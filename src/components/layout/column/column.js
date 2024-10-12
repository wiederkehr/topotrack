import { Flex } from "@radix-ui/themes";

export default function Column({ children }) {
  return (
    <Flex direction="column" minHeight="100vh">
      {children}
    </Flex>
  );
}
