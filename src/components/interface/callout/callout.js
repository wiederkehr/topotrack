import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout as RC } from "@radix-ui/themes";

export default function Callout({ children }) {
  return (
    <RC.Root>
      <RC.Icon>
        <InfoCircledIcon />
      </RC.Icon>
      <RC.Text>{children}</RC.Text>
    </RC.Root>
  );
}
