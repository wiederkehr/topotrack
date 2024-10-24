import { easeCubicOut } from "d3";
import { Map } from "mapbox-gl";

import computeCameraPosition from "./computeCameraPosition";

type FlyToPointProps = {
  duration: number;
  map: Map;
  startAltitude: number;
  startBearing: number;
  startPitch: number;
  stopAltitude: number;
  stopBearing: number;
  stopPitch: number;
  targetPosition: { lat: number; lng: number };
};

function flyToPoint({
  map,
  targetPosition,
  duration,
  startAltitude,
  stopAltitude,
  startBearing,
  stopBearing,
  startPitch,
  stopPitch,
}: FlyToPointProps): Promise<void> {
  return new Promise((resolve) => {
    let startTime: number | undefined;
    let currentAltitude: number;
    let currentBearing: number;
    let currentPitch: number;

    function frame(currentTime: number) {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Calculate progress
      const progress = (currentTime - startTime) / duration;
      const easedProgress = easeCubicOut(Math.min(progress, 1));

      // Interpolate values
      currentAltitude =
        startAltitude + (stopAltitude - startAltitude) * easedProgress;
      currentBearing =
        startBearing + (stopBearing - startBearing) * easedProgress;
      currentPitch = startPitch + (stopPitch - startPitch) * easedProgress;

      // Compute new camera position
      const cameraPosition = computeCameraPosition({
        targetPosition,
        altitude: currentAltitude,
        bearing: currentBearing,
        pitch: currentPitch,
      });

      // Set camera position
      map.setCenter([cameraPosition.lng, cameraPosition.lat]);
      map.setBearing(currentBearing);
      map.setPitch(currentPitch);
      map.setZoom(
        map.getZoom() + (stopAltitude - startAltitude) * easedProgress,
      );

      // Continue animation or resolve promise
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

export default flyToPoint;
