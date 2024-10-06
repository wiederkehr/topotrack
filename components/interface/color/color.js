import * as RP from "@radix-ui/react-popover";
import { SketchPicker } from "react-color";

import { colors } from "@/styles/constants";

import styles from "./color.module.css";

export default function Color({ value, onValueChange }) {
  const presetColors = [
    ...Object.values(colors.dark),
    ...Object.values(colors.light),
  ];

  return (
    <RP.Root>
      <RP.Trigger className={styles.colorTrigger}>
        {value}
        <i className={styles.colorIcon} style={{ backgroundColor: value }} />
      </RP.Trigger>
      <RP.Content className={styles.colorContent}>
        <SketchPicker
          color={value}
          onChange={(color) => onValueChange(color.hex)}
          presetColors={presetColors}
          width="250px"
        />
      </RP.Content>
    </RP.Root>
  );
}
