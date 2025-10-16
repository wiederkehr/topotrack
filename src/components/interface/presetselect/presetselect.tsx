import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import {
  Content,
  Item,
  ItemIndicator,
  ItemText,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value,
  Viewport,
} from "@radix-ui/react-select";

import { PresetType } from "@/types";

import { ColorGlyph } from "../colorglyph";
import styles from "./presetselect.module.css";

type PresetSelectProps = {
  onValueChange: (value: string) => void;
  presets: PresetType[];
  value: string;
};

/**
 * PresetSelect - Specialized select dropdown for color presets
 * Displays preset names with color glyphs for visual identification
 */
export function PresetSelect({
  value,
  onValueChange,
  presets,
}: PresetSelectProps) {
  /**
   * Extract color values from a preset object
   * Returns all values except the 'name' property
   */
  const getPresetColors = (preset: PresetType): string[] => {
    return Object.entries(preset)
      .filter(([key]) => key !== "name")
      .map(([, value]) => value);
  };

  const selectedPreset = presets.find((p) => p.name === value);

  return (
    <Root value={value} onValueChange={onValueChange}>
      <Trigger className={styles.presetSelectTrigger}>
        <div className={styles.presetSelectValue}>
          <Value>{value}</Value>
          {selectedPreset && (
            <ColorGlyph colors={getPresetColors(selectedPreset)} />
          )}
        </div>
      </Trigger>
      <Content className={styles.presetSelectContent}>
        <ScrollUpButton className={styles.presetSelectScrollButton}>
          <ChevronUpIcon />
        </ScrollUpButton>
        <Viewport className={styles.presetSelectViewport}>
          {presets.map((preset, index) => (
            <Item
              className={styles.presetSelectItem}
              value={preset.name}
              key={index}
            >
              <ItemIndicator className={styles.presetSelectItemIndicator}>
                <CheckIcon />
              </ItemIndicator>
              <ItemText className={styles.presetSelectItemText}>
                {preset.name}
              </ItemText>
              <ColorGlyph colors={getPresetColors(preset)} />
            </Item>
          ))}
        </Viewport>
        <ScrollDownButton className={styles.presetSelectScrollButton}>
          <ChevronDownIcon />
        </ScrollDownButton>
      </Content>
    </Root>
  );
}
