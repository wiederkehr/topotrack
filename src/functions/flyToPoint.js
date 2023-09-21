import { easeCubicOut } from "d3";
import { MercatorCoordinate } from "mapbox-gl";
import computeCameraPosition from "@/functions/computeCameraPosition";

const flyToPoint = async ({
  map,
  targetPosition,
  duration,
  startAltitude,
  endAltitude,
  startBearing,
  endBearing,
  startPitch,
  endPitch,
}) => {
  return new Promise(async (resolve) => {
    let startTime;

    var currentAltitude;
    var currentBearing;
    var currentPitch;

    const frame = async (currentTime) => {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Compute animation phase
      let animationPhase = (currentTime - startTime) / duration;
      // Fix animation to maximum 1
      if (animationPhase > 1) animationPhase = 1;

      // Compute camera altitude between start to end
      currentAltitude =
        startAltitude +
        (endAltitude - startAltitude) * easeCubicOut(animationPhase);
      // Compute camera bearing between start to end
      currentBearing =
        startBearing +
        (endBearing - startBearing) * easeCubicOut(animationPhase);
      // Compute camera pitch between start to end
      currentPitch =
        startPitch + (endPitch - startPitch) * easeCubicOut(animationPhase);

      // Compute corrected camera position, so the start of the path is always in view
      const correctedPosition = computeCameraPosition(
        currentPitch,
        currentBearing,
        targetPosition,
        currentAltitude
      );

      // Set corrected pitch and bearing of camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(currentPitch, currentBearing);
      // Set corrected position and altitude of camera
      camera.position = MercatorCoordinate.fromLngLat(
        correctedPosition,
        currentAltitude
      );

      // Set corrected camera options
      map.setFreeCameraOptions(camera);

      // End animation after duration and return current bearing, altitude, and pitch
      if (animationPhase === 1) {
        resolve({
          bearing: currentBearing,
          altitude: currentAltitude,
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
