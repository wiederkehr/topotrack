import { Flex } from "@radix-ui/themes";

import Callout from "@/components/interface/callout";

function Error() {
  return (
    <Flex m="5" direction="column">
      <Callout>
        Error loading activities. Please log out and log back in.
      </Callout>
    </Flex>
  );
}

export default Error;
