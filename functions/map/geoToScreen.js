import { geoMercator } from "d3-geo";

export default function geoToScreen(json_data, width, height, padding) {
  return geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding * 2, height - padding * 2],
    ],
    json_data
  );
}
