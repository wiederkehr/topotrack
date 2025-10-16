import { Box, Popover } from "@radix-ui/themes";
import { SketchPicker } from "react-color";

import { colors } from "@/styles/constants";

import styles from "./color.module.css";

type ColorProps = {
  onValueChange: (value: string) => void;
  value: string;
};

export function Color({ value, onValueChange }: ColorProps) {
  const presetColors = [
    ...Object.values(colors.dark),
    ...Object.values(colors.light),
    ...Object.values(colors.mono),
  ];
  return (
    <Popover.Root>
      <Popover.Trigger className={styles.colorTrigger}>
        <Box>
          <span className={styles.colorLabel}>{value}</span>
          <i className={styles.colorIcon} style={{ backgroundColor: value }} />
        </Box>
      </Popover.Trigger>
      <Popover.Content className={styles.colorContent}>
        <SketchPicker
          className={styles.colorPicker}
          styles={{
            default: {
              picker: {
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0",
              },
            },
          }}
          color={value}
          onChange={(color) => onValueChange(color.hex)}
          presetColors={presetColors}
          width="240px"
          disableAlpha={true}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
