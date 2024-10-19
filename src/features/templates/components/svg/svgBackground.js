export default function SVGBackground({ width, height, color }) {
  return (
    <rect
      id="background"
      x={0}
      y={0}
      width={width}
      height={height}
      fill={color}
    />
  );
}
