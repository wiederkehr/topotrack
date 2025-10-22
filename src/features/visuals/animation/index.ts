export { AnimationController } from "./AnimationController";
export type { AnimationSettings } from "./animationSettings";
export { DEFAULT_ANIMATION_SETTINGS } from "./animationSettings";
export {
  getFollowStrengthConfig,
  getFollowStrengthParameters,
} from "./animationSettings";
export * from "./durationCalculators";
export * from "./phaseCalculators";
export type {
  CameraKeyframe,
  PreCalculatedAnimation,
  ProgressKeypoint,
} from "./preCalculator";
export { preCalculateAnimation } from "./preCalculator";
export {
  interpolateCameraKeyframes,
  interpolateProgressKeypoints,
} from "./preCalculator";
export * from "./types";
