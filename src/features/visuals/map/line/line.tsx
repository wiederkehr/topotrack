import { memo } from "react";
import { Layer, Source } from "react-map-gl";

type LineProps = {
  data: GeoJSON.Feature<GeoJSON.LineString>;
  id?: string;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
};

/**
 * Line component for rendering a line on the map.
 */
function LineComponent({
  data,
  id,
  lineColor = "#FFF",
  lineWidth = 1,
  lineOpacity = 1,
}: LineProps) {
  return (
    <Source id={id} type="geojson" data={data}>
      <Layer
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": lineColor,
          "line-width": lineWidth,
          "line-opacity": lineOpacity,
        }}
      />
    </Source>
  );
}

const Line = memo(LineComponent);
export { Line };
