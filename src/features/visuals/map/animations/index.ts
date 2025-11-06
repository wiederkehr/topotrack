/* eslint-disable simple-import-sort/exports */
export { AnimationController } from "./controller";
export { calculateFollowBearing } from "./bearingCalculations";
export {
  generateCoordinateSequence,
  normalizedRoutePoints,
} from "./routeCalculations";
export { mapAnimations } from "./library";
export { playAnimation } from "./player";

export type {
  AnimatePathOptions,
  AnimatePointOptions,
  AnimateRouteOptions,
  AnimationPhase,
  AnimationSequence,
  BearingOptions,
  FitBoundsOptions,
  FollowPathOptions,
  RotateAroundPointOptions,
} from "./types";
