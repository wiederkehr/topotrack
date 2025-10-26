import type { Map as MapboxGLMap } from "mapbox-gl";

import type {
  AnimatePathOptions,
  AnimatePointOptions,
  AnimateRouteOptions,
  AnimationPhase,
  AnimationSequence,
  FitBoundsOptions,
  FollowPathOptions,
  RotateAroundPointOptions,
} from "./types";

/**
 * Map Animation Library
 * Provides a collection of animation phase creators for building animation sequences
 * aligned with native Mapbox GL JS animation methods.
 */
export const mapAnimations = {
  /**
   * Animate a point marker along a route
   * Uses a normalized route with evenly spaced points
   */
  animatePoint: (options: AnimatePointOptions): AnimationPhase => ({
    type: "animatePoint",
    options,
  }),

  /**
   * Animate a route path visualization
   * Uses a normalized route with evenly spaced points
   */
  animatePath: (options: AnimatePathOptions): AnimationPhase => ({
    type: "animatePath",
    options,
  }),

  /**
   * Animate a route with synchronized line and point animation
   * Both the line path and point marker animate in a single RAF loop
   * ensuring perfect synchronization without timing drift
   * Uses a normalized route with evenly spaced points
   */
  animateRoute: (options: AnimateRouteOptions): AnimationPhase => ({
    type: "animateRoute",
    options,
  }),

  /**
   * Fit the map to show bounds with optional padding
   * Uses native Mapbox GL `map.fitBounds()` method
   */
  fitBounds: (options: FitBoundsOptions): AnimationPhase => ({
    type: "fitBounds",
    options,
  }),

  /**
   * Ease to a location with smooth interpolation
   * Uses native Mapbox GL `map.easeTo()` method
   */
  easeTo: (options: Parameters<MapboxGLMap["easeTo"]>[0]): AnimationPhase => ({
    type: "easeTo",
    options,
  }),

  /**
   * Fly to a location with a smooth animated transition
   * Uses native Mapbox GL `map.flyTo()` method
   */
  flyTo: (options: Parameters<MapboxGLMap["flyTo"]>[0]): AnimationPhase => ({
    type: "flyTo",
    options,
  }),

  /**
   * Follow a path with camera movement
   * Uses requestAnimationFrame + Turf.js for camera positioning
   */
  followPath: (options: FollowPathOptions): AnimationPhase => ({
    type: "followPath",
    options,
  }),

  /**
   * Rotate the map around a point
   * Uses requestAnimationFrame for smooth continuous rotation
   */
  rotateAroundPoint: (options: RotateAroundPointOptions): AnimationPhase => ({
    type: "rotateAroundPoint",
    options,
  }),

  /**
   * Wait for a specified duration
   * Useful for pausing between animation phases
   */
  wait: (duration: number): AnimationPhase => ({
    type: "wait",
    duration,
  }),

  /**
   * Execute a custom animation function
   * Useful for complex animations not covered by built-in phases
   */
  custom: (fn: (map: MapboxGLMap) => Promise<void>): AnimationPhase => ({
    type: "custom",
    fn,
  }),

  /**
   * Create a synchronized animation group
   * Multiple animations execute in parallel with independent durations
   * Each animation must specify its own duration and parameters
   *
   * @example
   * mapAnimations.sync(
   *   mapAnimations.followPath(route, { duration: 3000, pitch: 0 }),
   *   mapAnimations.animatePoint({ route, duration: 3000, pointSourceId: "marker" })
   * )
   */
  sync(...phases: AnimationPhase[]): AnimationPhase {
    return {
      type: "sync",
      phases,
    };
  },

  /**
   * Combine multiple animation phases into a sequence
   * Phases will execute sequentially in order
   */
  sequence: (...phases: AnimationPhase[]): AnimationSequence => ({
    phases,
    totalDuration: calculateTotalDuration(phases),
  }),
};

/**
 * Calculate total duration of an animation sequence
 * Returns undefined if any phase has variable duration
 */
function calculateTotalDuration(phases: AnimationPhase[]): number | undefined {
  let total = 0;

  for (const phase of phases) {
    const duration = getPhaseEstimatedDuration(phase);
    if (duration === undefined) {
      return undefined; // Variable duration, can't calculate total
    }
    total += duration;
  }

  return total;
}

/**
 * Get estimated duration of a single animation phase
 * Returns undefined for phases with variable or unknown duration
 */
function getPhaseEstimatedDuration(phase: AnimationPhase): number | undefined {
  switch (phase.type) {
    case "wait":
      return phase.duration;

    case "followPath":
      return phase.options.duration;

    case "animatePoint":
      return phase.options.duration;

    case "animatePath":
      return phase.options.duration;

    case "animateRoute":
      return phase.options.duration;

    case "flyTo":
      return phase.options.duration ?? 2000; // Mapbox default

    case "easeTo":
      return phase.options.duration ?? 500; // Mapbox default

    case "fitBounds":
      return phase.options?.duration ?? 1000; // Mapbox default

    case "rotateAroundPoint":
      return phase.options.duration;

    case "sync": {
      // For sync groups, find the maximum duration of all child phases
      // since all animations run in parallel
      const syncPhase = phase as unknown as { phases: AnimationPhase[] };
      let maxDuration = 0;
      for (const childPhase of syncPhase.phases) {
        const childDuration = getPhaseEstimatedDuration(childPhase);
        if (childDuration === undefined) {
          return undefined; // If any child has variable duration, sync is variable
        }
        maxDuration = Math.max(maxDuration, childDuration);
      }
      return maxDuration;
    }

    case "custom":
      return undefined; // Can't estimate custom function duration

    default:
      return undefined;
  }
}
