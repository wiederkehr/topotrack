type Position = {
  lat: number;
  lng: number;
};

type ComputeCameraPositionProps = {
  altitude: number;
  bearing: number;
  pitch: number;
  smooth?: number;
  targetPosition: Position;
};

let previousCameraPosition: Position | undefined;

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

function computeCameraPosition({
  targetPosition,
  altitude,
  bearing,
  pitch,
  smooth,
}: ComputeCameraPositionProps): Position {
  const bearingInRadian = bearing / 57.29;
  const pitchInRadian = (90 - pitch) / 57.29;

  const lngDiff =
    ((altitude / Math.tan(pitchInRadian)) * Math.sin(-bearingInRadian)) / 70000; // ~70km/degree longitude
  const latDiff =
    ((altitude / Math.tan(pitchInRadian)) * Math.cos(-bearingInRadian)) /
    110000; // 110km/degree latitude

  const correctedLng = targetPosition.lng + lngDiff;
  const correctedLat = targetPosition.lat + latDiff;

  const newCameraPosition: Position = { lng: correctedLng, lat: correctedLat };

  if (smooth && previousCameraPosition) {
    newCameraPosition.lng = lerp(
      previousCameraPosition.lng,
      correctedLng,
      smooth,
    );
    newCameraPosition.lat = lerp(
      previousCameraPosition.lat,
      correctedLat,
      smooth,
    );
  }

  previousCameraPosition = newCameraPosition;

  return newCameraPosition;
}

export default computeCameraPosition;
