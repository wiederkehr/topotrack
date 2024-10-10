import { Flex } from "@radix-ui/themes";

import Callout from "@/components/interface/callout";

export default function Welcome() {
  return (
    <Flex m="5" direction="column">
      <Callout>Welcome, please sign in with Strava to get started.</Callout>
    </Flex>
  );
}
