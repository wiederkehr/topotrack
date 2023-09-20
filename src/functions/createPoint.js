// Could be replaced by Turf
// https://turfjs.org/docs/#point
const createPoint = (coordinates) => {
  return {
    type: "Point",
    coordinates: coordinates,
  };
};

export default createPoint;
