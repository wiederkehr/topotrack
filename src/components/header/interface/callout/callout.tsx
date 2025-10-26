import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout as RxCallout } from "@radix-ui/themes";
import { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  m?: string;
};

export function Callout({ children, m }: CalloutProps) {
  return (
    <RxCallout.Root m={m}>
      <RxCallout.Icon>
        <InfoCircledIcon />
      </RxCallout.Icon>
      <RxCallout.Text>{children}</RxCallout.Text>
    </RxCallout.Root>
  );
}
