import { scaleLinear } from "d3-scale";
import { curveCatmullRom, line } from "d3-shape";

type SVGProfileProps = {
  data: number[];
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

  return (
    <g>
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
