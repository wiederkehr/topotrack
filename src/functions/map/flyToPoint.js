import { easeCubicOut } from "d3";
import { MercatorCoordinate } from "mapbox-gl";

import computeCameraPosition from "@/functions/map/computeCameraPosition";

const flyToPoint = async ({
  map,
  targetPosition,
  duration,
  startAltitude,
  stopAltitude,
  startBearing,
  stopBearing,
  startPitch,
  stopPitch,
}) => {
  return new Promise(async (resolve) => {
    let startTime;
    let currentAltitude;
    let currentBearing;
    let currentPitch;

    const frame = async (currentTime) => {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Compute animation phase
      let animationPhase = (currentTime - startTime) / duration;
      // Fix animation to maximum 1
      if (animationPhase > 1) animationPhase = 1;

      // Compute camera altitude between start to stop
      currentAltitude =
        startAltitude +
        (stopAltitude - startAltitude) * easeCubicOut(animationPhase);
      // Compute camera bearing between start to stop
      currentBearing =
        startBearing +
        (stopBearing - startBearing) * easeCubicOut(animationPhase);
      // Compute camera pitch between start to stop
      currentPitch =
        startPitch + (stopPitch - startPitch) * easeCubicOut(animationPhase);

      // Compute corrected camera position, so the start of the path is always in view
      const correctedPosition = computeCameraPosition({
        targetPosition: targetPosition,
        altitude: currentAltitude,
        bearing: currentBearing,
        pitch: currentPitch,
        smooth: false,
      });
      // Set corrected pitch and bearing of camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(currentPitch, currentBearing);
      // Set corrected position and altitude of camera
      camera.position = MercatorCoordinate.fromLngLat(
        correctedPosition,
        currentAltitude,
      );

      // Set corrected camera options
      map.setFreeCameraOptions(camera);

      // End animation after duration and return current bearing, altitude, and pitch
      if (animationPhase === 1) {
        resolve({
          altitude: currentAltitude,
          bearing: currentBearing,
          pitch: currentPitch,
        });
        return;
      }
      window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  });
};

export default flyToPoint;
