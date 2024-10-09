import Module from "@/components/interface/module";
import Select from "@/components/interface/select";

export default function Preset({ preset, presets, onPresetChange }) {
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
