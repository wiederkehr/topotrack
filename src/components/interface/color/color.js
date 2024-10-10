import * as RP from "@radix-ui/react-popover";
import { CustomPicker, SketchPicker } from "react-color";

import { colors } from "@/styles/constants";

import styles from "./color.module.css";

const ColorPicker = CustomPicker(({ color, onChange }) => {
  const presetColors = [
    ...Object.values(colors.dark),
    ...Object.values(colors.light),
  ];
  return (
    <SketchPicker
      color={color}
      onChange={onChange}
      presetColors={presetColors}
      width="250px"
    />
  );
});

export default function Color({ value, onValueChange }) {
  return (
    <RP.Root>
      <RP.Trigger className={styles.colorTrigger}>
        <span className={styles.colorLabel}>{value}</span>
        <i className={styles.colorIcon} style={{ backgroundColor: value }} />
      </RP.Trigger>
      <RP.Content className={styles.colorContent}>
        <ColorPicker
          color={value}
          onChange={(color) => onValueChange(color.hex)}
        />
      </RP.Content>
    </RP.Root>
  );
}
