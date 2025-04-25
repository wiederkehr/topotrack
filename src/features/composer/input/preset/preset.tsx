import { Module } from "@/components/interface/module";
import Select from "@/components/interface/select";
import { PresetType } from "@/types";

type PresetProps = {
  onPresetChange: (value: string) => void;
  preset: PresetType;
  presets: PresetType[];
};

function Preset({ preset, presets, onPresetChange }: PresetProps) {
  return (
    <Module label="Preset">
      <Select
        value={preset.name}
        onValueChange={onPresetChange}
        options={presets.map(({ name }) => name)}
      />
    </Module>
  );
}

export default Preset;
