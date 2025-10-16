import type { OverrideType } from "@/types";

type DestructuredOverrides = {
  [key: string]: string;
};

function destructureOverrides(
  overrides: OverrideType[],
): DestructuredOverrides {
  return overrides.reduce((acc, override) => {
    acc[override.name] = override.value || "";
    return acc;
  }, {} as DestructuredOverrides);
}

export { destructureOverrides };
