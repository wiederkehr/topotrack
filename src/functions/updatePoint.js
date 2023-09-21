import { lineDistance, along } from "@turf/turf";
import { MercatorCoordinate } from "mapbox-gl";
import computeCameraPosition from "@/functions/computeCameraPosition";

const updatePoint = async ({ duration, path, onUpdate }) => {
  return new Promise(async (resolve) => {
    let startTime;

    const pathDistance = lineDistance(path);

    const frame = async (currentTime) => {
      // Set start time
      if (!startTime) startTime = currentTime;
      // Compute animation phase
      let animationPhase = (currentTime - startTime) / duration;
      // Fix animation to maximum 1
      if (animationPhase > 1) animationPhase = 1;

      // Compute distance along path
      const alongPath = along(path, pathDistance * animationPhase).geometry
        .coordinates;
      // Set position of progress point
      const targetPosition = {
        lng: alongPath[0],
        lat: alongPath[1],
      };
      onUpdate(targetPosition);
      // End animation after duration and return current bearing, altitude, and pitch
      if (animationPhase === 1) {
        resolve();
        return;
      }
      window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
  });
};

export default updatePoint;
