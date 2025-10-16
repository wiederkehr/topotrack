import { TextField } from "@radix-ui/themes";
import { ChangeEvent } from "react";

type TextProps = {
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function Text({ value, onValueChange, placeholder }: TextProps) {
  return (
    <TextField.Root
      size="2"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onValueChange(event.target.value)
      }
      placeholder={placeholder}
    />
  );
}
