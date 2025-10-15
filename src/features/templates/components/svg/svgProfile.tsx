import { scaleLinear } from "d3-scale";
import { area, curveCatmullRom, line } from "d3-shape";

type SVGProfileProps = {
  data: number[];
  fillColor?: string;
  fillGradient?: {
    endColor: string;
    startColor: string;
  };
  height: number;
  strokeColor: string;
  strokeWidth: number;
  width: number;
};

function SVGProfile({
  data,
  height,
  width,
  strokeColor,
  strokeWidth,
  fillColor,
  fillGradient,
}: SVGProfileProps) {
  // Scales
  // //////////////////////////////
  const xScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);
  const minAlt = Math.min(...data);
  const maxAlt = Math.max(...data);
  const yScale = scaleLinear().domain([minAlt, maxAlt]).range([height, 0]);

  // Line
  // //////////////////////////////
  const lineGenerator = line<[number, number]>()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d[1]))
    .curve(curveCatmullRom.alpha(0.5));
  const points: [number, number][] = data.map((alt, i) => [i, alt]);
  const lineData = lineGenerator(points);

  // Area (for fill)
  // //////////////////////////////
  const areaGenerator = area<[number, number]>()
    .x((d, i) => xScale(i))
    .y0(height)
    .y1((d) => yScale(d[1]))
    .curve(curveCatmullRom.alpha(0.5));
  const areaData = areaGenerator(points);

  // Fill
  // //////////////////////////////
  const gradientId = `profile-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const hasFill = fillColor || fillGradient;
  const fillValue = fillGradient ? `url(#${gradientId})` : fillColor || "none";

  return (
    <g>
      {fillGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillGradient.startColor} />
            <stop offset="100%" stopColor={fillGradient.endColor} />
          </linearGradient>
        </defs>
      )}
      {hasFill && <path d={areaData || ""} fill={fillValue} stroke="none" />}
      <path
        d={lineData || ""}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeMiterlimit={4}
      />
    </g>
  );
}

export { SVGProfile };
