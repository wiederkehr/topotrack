import { geoBounds, geoMercator } from "d3-geo";
import { curveCatmullRom, line } from "d3-shape";

import styles from "./background.module.css";

const Background = ({ data, height, width }) => {
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
  const padding = 40;
  const viewbox = `0 0 ${width} ${height}`;
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
  const rotation = `rotate(${angle})`;

  // Projection
  // //////////////////////////////
  const projection = geoMercator()
    .angle(angle)
    .fitSize([innerWidth, innerHeight], featureCollection);

  const pathLeftBottom = projection(bounds[0]);
  const pathRightTop = projection(bounds[1]);
  const pathLeft = pathLeftBottom[0];
  const pathRight = pathRightTop[0];
  const pathTop = rotate ? pathLeftBottom[1] : pathRightTop[1];
  const pathBottom = rotate ? pathRightTop[1] : pathLeftBottom[1];
  const pathWidth = pathRight - pathLeft;
  const pathHeight = pathBottom - pathTop;

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
        <rect
          id="full-width-and-height"
          x={0}
          y={0}
          width={width}
          height={height}
          fill="rgba(255,0,0,0.1)"
        />
        <g id="background-translation-group" transform={translation}>
          <rect
            id="innner-width-and-height"
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="none"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.5"
            strokeDasharray="4"
          />
          <rect
            id="path-width-and-height"
            x={pathLeft}
            y={pathTop}
            width={pathWidth}
            height={pathHeight}
            rotation={rotation}
            fill="none"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.5"
            strokeDasharray="2"
          />
          <path
            d={lineData}
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            strokeMiterlimit="4"
          />
        </g>
      </svg>
    </div>
  );
};

export default Background;
