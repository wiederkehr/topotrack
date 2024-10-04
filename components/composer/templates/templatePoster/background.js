import { geoBounds, geoMercator } from "d3-geo";
import { curveCatmullRom, line } from "d3-shape";
import styles from "./background.module.css";

const Background = ({ data, height, width }) => {
  // Dimensions
  // //////////////////////////////
  const viewbox = `0 0 ${width} ${height}`;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const side = Math.max(height, width);
  const diagonal = Math.sqrt(2 * (side * side));

  // Features
  // //////////////////////////////
  const features = data.map((d) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [d[1], d[0]],
    },
  }));

  // Rotation
  // //////////////////////////////
  const bounds = geoBounds({
    type: "FeatureCollection",
    features: features,
  });

  const formatRatio = width / height;
  const pathRatio =
    (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
  const shouldRotate = formatRatio < 1 && pathRatio > 1;
  const angle = shouldRotate ? "90" : "0";

  // TODO: Add a rotation to the projection
  const extent = [
    [padding, padding],
    [innerWidth, innerHeight],
  ];

  // NOTE: Deactivate translation
  // const translation = `translate(-${(diagonal - innerWidth) / 2}, -${
  //   (diagonal - innerHeight) / 2
  // })`;
  const translation = "";
  // NOTE: Deactivate rotation
  // const rotation = `rotate(${angle}, ${diagonal / 2}, ${diagonal / 2})`;
  const rotation = "";

  // Projection
  // //////////////////////////////
  const projection = geoMercator().fitExtent(extent, {
    type: "FeatureCollection",
    features: features,
  });

  // Line
  // //////////////////////////////
  const lineGenerator = line()
    .x((d) => projection(d)[0])
    .y((d) => projection(d)[1])
    .curve(curveCatmullRom.alpha(0.5));

  const lineData = lineGenerator(features.map((d) => d.geometry.coordinates));

  return (
    <div className={styles.background}>
      <svg viewBox={viewbox}>
        <g id="foreground-translation-group" transform={translation}>
          <g id="foreground-rotation-group" transform={rotation}>
            <path
              d={lineData}
              fill="none"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              strokeMiterlimit="4"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Background;
