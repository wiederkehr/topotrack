export const mapStyleOptions: string[] = ["Light", "Dark"];
const mapsStyles = {
  Light: "mapbox://styles/benjaminwiederkehr/clmzlvsu3023i01r81cc979q5",
  Dark: "mapbox://styles/benjaminwiederkehr/cm1o1o9zc00mv01qt0689hvjp",
};
export type MapShadeType = "Light" | "Dark";
export type MapStyleProps = {
  mapShade: MapShadeType;
};

export function mapStyle(options?: MapStyleProps): string {
  const { mapShade } = options || {};
  return mapsStyles[mapShade as keyof typeof mapsStyles];
}
