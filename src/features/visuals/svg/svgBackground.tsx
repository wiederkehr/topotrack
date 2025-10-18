type SVGBackgroundProps = {
  color: string;
  height: number;
  width: number;
};

function SVGBackground({ width, height, color }: SVGBackgroundProps) {
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

export { SVGBackground };
