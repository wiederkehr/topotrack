import type { UnitSystem } from "@/stores/useUnitStore";

const metersToKilometers = (meters: number) => meters / 1000;
const metersToMiles = (meters: number) => meters / 1609.344;

const formatterKm = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "short",
  maximumFractionDigits: 2,
});

const formatterMi = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "mile",
  unitDisplay: "short",
  maximumFractionDigits: 2,
});

function formatDistance(meters: number, units: UnitSystem): string {
  if (units === "imperial") {
    return formatterMi.format(metersToMiles(meters));
  }
  return formatterKm.format(metersToKilometers(meters));
}

export { formatDistance };
