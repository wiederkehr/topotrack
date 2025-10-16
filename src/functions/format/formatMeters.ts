const formatter = Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

/**
 * Formats a number as meters without unit conversion.
 * For unit-aware formatting that respects user preferences, use:
 * - formatDistance() for distances (converts to km or miles)
 * - formatElevation() for elevation gain (converts to m or ft)
 */
function formatMeters(number: number): string {
  return formatter.format(number);
}

export { formatMeters };
