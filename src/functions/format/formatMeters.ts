const formatter = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

export default function formatMeters(number: number): string {
  return formatter.format(number);
}
