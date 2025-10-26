import { memo } from "react";
import { Layer, Source } from "react-map-gl";

type CircleProps = {
  circleColor?: string;
  circleRadius?: number;
  data: GeoJSON.Feature<GeoJSON.Point>;
  id?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

/**
 * Circle component for rendering a circle on the map.
 */
function CircleComponent({
  data,
  circleColor = "#FFF",
  circleRadius = 4,
  id,
  strokeColor = "#FFF",
  strokeWidth = 1,
}: CircleProps) {
  return (
    <Source id={id} type="geojson" data={data}>
      <Layer
        type="circle"
        paint={{
          "circle-color": circleColor,
          "circle-radius": circleRadius,
          "circle-stroke-width": strokeWidth,
          "circle-stroke-color": strokeColor,
        }}
      />
    </Source>
  );
}

const Circle = memo(CircleComponent);
export { Circle };
