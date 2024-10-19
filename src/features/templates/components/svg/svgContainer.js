export default function SVGContainer({ children, height, width }) {
  const viewbox = `0 0 ${width} ${height}`;
  return <svg viewBox={viewbox}>{children}</svg>;
}
