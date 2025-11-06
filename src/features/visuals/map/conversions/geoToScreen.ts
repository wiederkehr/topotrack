import { geoMercator, GeoProjection } from "d3-geo";

type GeoToScreenProps = {
  height: number;
  json_data: GeoJSON.FeatureCollection;
  padding: number;
  width: number;
};

function geoToScreen({
  json_data,
  width,
  height,
  padding,
}: GeoToScreenProps): GeoProjection {
  return geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding * 2, height - padding * 2],
    ],
    json_data,
  );
}

export { geoToScreen };
