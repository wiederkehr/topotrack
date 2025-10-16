import Label from "@/components/interface/label";
import { Module, Submodule } from "@/components/interface/module";
import Text from "@/components/interface/text";
import { ActivityType, OverrideType } from "@/types";

type OverridesProps = {
  activity: ActivityType | undefined;
  onOverrideChange: (override: { name: string; value: string }) => void;
  overrides: OverrideType[];
};

function Overrides({ overrides, onOverrideChange, activity }: OverridesProps) {
  if (!activity || overrides.length === 0) {
    return null;
  }

  return (
    <Module label="Content">
      {overrides.map((override) => {
        // Use the activity's property as placeholder
        // Only use string values as placeholders to avoid stringification issues
        const activityValue = activity[override.name as keyof ActivityType];
        const placeholder =
          typeof activityValue === "string" ? activityValue : undefined;

        return (
          <Submodule key={override.name}>
            <Label>{override.label}</Label>
            <Text
              value={override.value ?? ""}
              onValueChange={(value) => {
                onOverrideChange({ name: override.name, value: value });
              }}
              placeholder={placeholder}
            />
          </Submodule>
        );
      })}
    </Module>
  );
}

export default Overrides;
