import type { Map as MapboxGLMap } from "mapbox-gl";

import { playAnimatePath } from "./playAnimatePath";
import { playAnimatePoint } from "./playAnimatePoint";
import { playAnimateRoute } from "./playAnimateRoute";
import { playEaseTo } from "./playEaseTo";
import { playFitBounds } from "./playFitBounds";
import { playFlyTo } from "./playFlyTo";
import { playFollowPath } from "./playFollowPath";
import { playRotateAroundPoint } from "./playRotateAroundPoint";
import { playSync } from "./playSync";
import { playWait } from "./playWait";
import type { AnimationPhase, AnimationSequence } from "./types";

/**
 * Play an animation sequence or single phase on a Mapbox GL map
 * Can accept either an AnimationSequence (multiple phases) or a single AnimationPhase
 *
 * @example
 * // Play a single phase directly
 * await playAnimation(map, mapAnimations.flyTo({ center: [0, 0], zoom: 10 }));
 *
 * @example
 * // Play a sequence of phases
 * await playAnimation(map, mapAnimations.sequence(
 *   mapAnimations.wait(500),
 *   mapAnimations.flyTo({ center: [0, 0], zoom: 10 })
 * ));
 */
export async function playAnimation(
  map: MapboxGLMap,
  animation: AnimationSequence | AnimationPhase,
): Promise<void> {
  // If it's a sequence, execute all phases
  if ("phases" in animation && Array.isArray(animation.phases)) {
    const sequence = animation as AnimationSequence;
    for (const phase of sequence.phases) {
      await playPhase(map, phase);
    }
  } else {
    // If it's a single phase, execute it directly
    await playPhase(map, animation as AnimationPhase);
  }
}

/**
 * Play a single animation phase
 * Returns a promise that resolves when the phase completes
 */
async function playPhase(
  map: MapboxGLMap,
  phase: AnimationPhase,
): Promise<void> {
  if (phase.type === "flyTo") {
    return playFlyTo(map, phase.options);
  }
  if (phase.type === "easeTo") {
    return playEaseTo(map, phase.options);
  }
  if (phase.type === "fitBounds") {
    return playFitBounds(map, phase.options);
  }
  if (phase.type === "followPath") {
    return playFollowPath(map, phase.options);
  }
  if (phase.type === "animatePoint") {
    return playAnimatePoint(map, phase.options);
  }
  if (phase.type === "animatePath") {
    return playAnimatePath(map, phase.options);
  }
  if (phase.type === "animateRoute") {
    return playAnimateRoute(map, phase.options);
  }
  if (phase.type === "wait") {
    return playWait(phase.duration);
  }
  if (phase.type === "custom") {
    return phase.fn(map);
  }
  if (phase.type === "rotateAroundPoint") {
    return playRotateAroundPoint(map, phase.options);
  }
  if (phase.type === "sync") {
    return playSync(map, phase.phases, playPhase);
  }

  // Exhaustive check
  const _exhaustive: never = phase;
  return _exhaustive;
}
