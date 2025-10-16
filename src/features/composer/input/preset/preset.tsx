import { Module } from "@/components/interface/module";
import { PresetSelect } from "@/components/interface/presetselect";
import { PresetType } from "@/types";

type PresetProps = {
  onPresetChange: (value: string) => void;
  preset: PresetType;
  presets: PresetType[];
};

export function Preset({ preset, presets, onPresetChange }: PresetProps) {
  return (
    <Module label="Preset">
      <PresetSelect
        value={preset.name}
        onValueChange={onPresetChange}
        presets={presets}
      />
    </Module>
  );
}
