import type { ExtendedFeatureCollection } from "d3-geo";
import type { ExtendedFeature } from "d3-geo";
import { geoBounds, geoMercator } from "d3-geo";
import { curveCatmullRom, line } from "d3-shape";

type SVGRouteProps = {
  color: string;
  data: [number, number][];
  height: number;
  width: number;
};

function SVGRoute({ data, height, width, color }: SVGRouteProps) {
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

  /**
   * @see: https://d3js.org/d3-geo/math#geoBounds
   * @returns: [[left, bottom], [right, top]]
   **/
  const bounds: [[number, number], [number, number]] =
    geoBounds(featureCollection);

  // Dimensions
  // //////////////////////////////
  const factor = 40 / 1080;
  const padding = width * factor;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const innerRatio = innerWidth / innerHeight;
  const boundsWidth = bounds[1][0] - bounds[0][0];
  const boundsHeight = bounds[1][1] - bounds[0][1];
  const boundsRatio = boundsWidth / boundsHeight;

  // Rotation
  // //////////////////////////////

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shouldRotate =
    (innerRatio < 1 && boundsRatio > 1) || (innerRatio > 1 && boundsRatio < 1);
  const translation = `translate(${padding}, ${padding})`;

  // Projection
  // //////////////////////////////
  const projection = geoMercator()
    .angle(0)
    .fitSize([innerWidth, innerHeight], featureCollection);

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
  const strokeWidth = width * 0.004;

  return (
    <g id="route-translation-group" transform={translation}>
      <path
        d={lineData || ""}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeMiterlimit="4"
      />
    </g>
  );
}

export { SVGRoute };
