import { formatMeters } from "@/functions/format";
import { colors } from "@/styles/constants";
import classNames from "classnames";
import { geoBounds, geoMercator, geoPath } from "d3-geo";
import { curveCatmullRom, line } from "d3-shape";
import styles from "./index.module.css";

export const name = "Poster";

const themeOptions = ["Light", "Dark"];
const accentOptions = ["Blue", "Green", "Purple", "White", "Red"];

export const variables = [
  {
    label: "Theme",
    name: "theme",
    options: themeOptions,
    type: "select",
  },
  {
    label: "Accent",
    name: "accent",
    options: accentOptions,
    type: "color",
  },
];

export const presets = [
  {
    name: "Poster Preset 1",
    theme: themeOptions[0],
    accent: "Blue",
  },
  {
    name: "Poster Preset 2",
    theme: themeOptions[1],
    accent: accentOptions[1],
  },
];

export const render = ({ activity, activityData, variables, format }) => {
  console.log("activity", activity);
  console.log("activityData", activityData[0]?.data[0]);

  return (
    <>
      <Background data={activityData[0]?.data} format={format} />
      <Foreground
        name={activity?.name}
        type={activity?.type}
        dateString={activity?.start_date_local}
        distance={formatMeters(activity?.distance)}
        elevation={activity?.total_elevation_gain}
      />
    </>
  );
};

const Background = ({ data, format }) => {
  const { height, width } = format;
  const viewbox = `0 0 ${width} ${height}`;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const extent = [
    [padding, padding],
    [innerWidth, innerHeight],
  ];

  const features = data.map((d) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [d[1], d[0]],
    },
  }));

  const projection = geoMercator().fitExtent(extent, {
    type: "FeatureCollection",
    features: features,
  });

  const bounds = geoBounds({
    type: "FeatureCollection",
    features: features,
  });

  const lineGenerator = line()
    .x((d) => projection(d)[0])
    .y((d) => projection(d)[1])
    .curve(curveCatmullRom.alpha(0.5));

  const lineData = lineGenerator(features.map((d) => d.geometry.coordinates));

  const formatRatio = width / height;
  const pathRatio =
    (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);
  const shouldRotate = formatRatio > 1 && pathRatio < 1;
  const rotate = shouldRotate ? "90" : "0";

  return (
    <div className={styles.background}>
      <svg viewBox={viewbox}>
        <g transform={`rotate(${rotate})`}>
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

const Foreground = ({ name, type, dateString, distance, elevation }) => {
  const date = new Date(Date.parse(dateString));
  const day = date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
  });
  const year = date.toLocaleDateString("en-us", { year: "numeric" });
  return (
    <div className={styles.foreground}>
      <div className={styles.topLeft}>
        <ForegroundType level="primary">{name}</ForegroundType>
        <ForegroundType level="secondary">{type}</ForegroundType>
      </div>
      <div className={styles.topRight}>
        <ForegroundType level="primary">{day}</ForegroundType>
        <ForegroundType level="secondary">{year}</ForegroundType>
      </div>
      <div className={styles.bottomRight}>
        <ForegroundType level="primary">{distance}</ForegroundType>
        <ForegroundType level="secondary">{elevation}</ForegroundType>
      </div>
    </div>
  );
};

const ForegroundType = ({ children, level }) => {
  return (
    <span
      style={{ color: colors.accent }}
      className={classNames(
        styles.type,
        level === "primary" ? styles.typePrimary : null,
        level === "secondary" ? styles.typeSecondary : null
      )}
    >
      {children}
    </span>
  );
};
