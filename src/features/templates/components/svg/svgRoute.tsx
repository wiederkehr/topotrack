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
  const features = data.map((d) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [d[1], d[0]],
    },
  }));
  const featureCollection = {
    type: "FeatureCollection",
    features: features,
  };

  /**
   * @see: https://d3js.org/d3-geo/math#geoBounds
   * @returns: [[left, bottom], [right, top]]
   **/
  const bounds = geoBounds(featureCollection);

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

  const rotate =
    (innerRatio < 1 && boundsRatio > 1) || (innerRatio > 1 && boundsRatio < 1);
  const angle = rotate ? -90 : 0;

  const translation = `translate(${padding}, ${padding})`;

  // Projection
  // //////////////////////////////
  const projection = geoMercator()
    .angle(angle)
    .fitSize([innerWidth, innerHeight], featureCollection);

  // Line
  // //////////////////////////////
  const lineGenerator = line<[number, number]>()
    .x((d) => projection(d)[0])
    .y((d) => projection(d)[1])
    .curve(curveCatmullRom.alpha(0.5));

  const lineData = lineGenerator(
    features.map((d) => d.geometry.coordinates as [number, number]),
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
