// Could be replaced by Turf
// https://turfjs.org/docs/#lineString
const createLine = (coordinates) => {
  return {
    type: "LineString",
    coordinates: coordinates,
  };
};

export default createLine;
