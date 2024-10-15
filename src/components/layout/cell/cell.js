import { Flex } from "@radix-ui/themes";

export default function Cell({ children }) {
  return (
    <Flex direction="column" minHeight={{ initial: "100vh" }}>
      {children}
    </Flex>
  );
}
