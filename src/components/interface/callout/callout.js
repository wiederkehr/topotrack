import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout as RxCallout } from "@radix-ui/themes";

export default function Callout({ children }) {
  return (
    <RxCallout.Root>
      <RxCallout.Icon>
        <InfoCircledIcon />
      </RxCallout.Icon>
      <RxCallout.Text>{children}</RxCallout.Text>
    </RxCallout.Root>
  );
}
