const formatter = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

function formatMeters(number: number): string {
  return formatter.format(number);
}

export { formatMeters };
