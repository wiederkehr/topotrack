<script>
  import { Point, Circle, Segment } from '@flatten-js/core';
  import { colors } from '$styles/constants.js';

  const width = 300;
  const height = 200;
  const segment1 = new Segment(10, 10, 200, 200);
  const segment2 = new Segment(10, 160, 200, 30);
  const circle = new Circle(new Point(200, 110), 50);
  const intersections = segment1.intersect(segment2);
  const lineStyle = { stroke: colors.accent, strokeWidth: 2 };
  const circleStyle = { stroke: 'none', fill: colors.accent };
  const dotStyle = { stroke: 'none', fill: colors.accent };
</script>

<markup>
  <svg {width} {height} viewBox={`0 0 ${width} ${height}`}
    >{@html segment1.svg(lineStyle) +
      segment2.svg(lineStyle) +
      circle.svg(circleStyle) +
      intersections[0].svg(dotStyle)}</svg
  >
</markup>
