const { buildGPX, StravaBuilder } = require("gpx-builder");
const { Point } = StravaBuilder.MODELS;

export function createGPX(data) {
  const points = data.map((d) => new Point(d[0], d[1]));
  const gpxData = new StravaBuilder();
  gpxData.setSegmentPoints(points);
  return buildGPX(gpxData.toObject());
}
