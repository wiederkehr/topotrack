import type { UnitSystem } from "@/stores/useUnitStore";

const metersToFeet = (meters: number) => meters * 3.28084;

const formatterM = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

const formatterFt = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "foot",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

function formatElevation(meters: number, units: UnitSystem): string {
  if (units === "imperial") {
    return formatterFt.format(metersToFeet(meters));
  }
  return formatterM.format(meters);
}

export { formatElevation };
