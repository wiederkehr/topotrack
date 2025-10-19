import type { ExtendedFeatureCollection } from "d3-geo";
import type { ExtendedFeature } from "d3-geo";
import { geoMercator } from "d3-geo";
import { curveCatmullRom, line } from "d3-shape";

type SVGRouteProps = {
  data: [number, number][];
  height: number;
  strokeColor: string;
  strokeWidth: number;
  width: number;
};

function SVGRoute({
  strokeColor,
  data,
  height,
  width,
  strokeWidth,
}: SVGRouteProps) {
  // Features
  // //////////////////////////////
  const features: ExtendedFeature[] = data.map((d) => ({
    type: "Feature",
    properties: null,
    geometry: { type: "Point", coordinates: [d[1], d[0]] },
  }));
  const featureCollection: ExtendedFeatureCollection = {
    type: "FeatureCollection",
    features: features,
  };

  // Projection
  // //////////////////////////////
  const projection = geoMercator()
    .angle(0)
    .fitSize([width, height], featureCollection);

  // Line
  // //////////////////////////////
  const lineGenerator = line<[number, number]>()
    .x((d) => {
      const projected = projection(d);
      return projected ? projected[0] : 0;
    })
    .y((d) => {
      const projected = projection(d);
      return projected ? projected[1] : 0;
    })
    .curve(curveCatmullRom.alpha(0.5));

  const lineData = lineGenerator(
    features
      .map((d) =>
        d.geometry && "coordinates" in d.geometry
          ? d.geometry.coordinates
          : null,
      )
      .filter((d): d is [number, number] => d !== null),
  );

  return (
    <g>
      <path
        d={lineData || ""}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeMiterlimit="4"
      />
    </g>
  );
}

export { SVGRoute };
