import { Module } from "@/components/interface/module";
import Select from "@/components/interface/select";

type PresetProps = {
  onPresetChange: (value: string) => void;
  preset: {
    name: string;
  };
  presets: {
    name: string;
  }[];
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
export type { PresetProps };
