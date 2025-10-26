import type { Map } from "mapbox-gl";
import { LngLatBoundsLike } from "mapbox-gl";

import type { PaddingType } from "@/types";

type FitToBoundsProps = {
  bearing: number;
  bounds: LngLatBoundsLike;
  map: Map;
  padding: PaddingType;
  pitch: number;
};

function fitToBounds({
  map,
  bounds,
  bearing,
  pitch,
  padding,
}: FitToBoundsProps) {
  if (!map.loaded()) return;
  map.fitBounds(bounds, {
    duration: 300,
    bearing: bearing,
    pitch: pitch,
    padding: {
      top: padding.top,
      bottom: padding.bottom,
      left: padding.left,
      right: padding.right,
    },
  });
}

export { fitToBounds };
