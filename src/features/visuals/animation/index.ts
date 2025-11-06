/**
 * Animation system exports
 * Uses the new real-time animation system located in src/features/visuals/map/animations/
 */

export type {
  AnimatePathOptions,
  AnimatePointOptions,
  AnimateRouteOptions,
  AnimationPhase,
  AnimationSequence,
  FitBoundsOptions,
  FollowPathOptions,
  RotateAroundPointOptions,
} from "@/features/visuals/map/animations";
export {
  mapAnimations,
  playAnimation,
} from "@/features/visuals/map/animations";
