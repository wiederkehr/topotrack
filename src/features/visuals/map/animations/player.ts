import type { Map as MapboxGLMap } from "mapbox-gl";

import { playAnimatePath } from "./plays/playAnimatePath";
import { playAnimatePoint } from "./plays/playAnimatePoint";
import { playAnimateRoute } from "./plays/playAnimateRoute";
import { playEaseTo } from "./plays/playEaseTo";
import { playFitBounds } from "./plays/playFitBounds";
import { playFlyTo } from "./plays/playFlyTo";
import { playFollowPath } from "./plays/playFollowPath";
import { playRotateAroundPoint } from "./plays/playRotateAroundPoint";
import { playSync } from "./plays/playSync";
import { playWait } from "./plays/playWait";
import type { AnimationPhase, AnimationSequence } from "./types";

/**
 * Play an animation sequence or single phase on a Mapbox GL map
 * Can accept either an AnimationSequence (multiple phases) or a single AnimationPhase
 *
 * @param map - Mapbox GL map instance
 * @param animation - Animation sequence or phase to play
 * @param signal - Optional AbortSignal for cancellation
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
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  // If it's a sequence, execute all phases
  if ("phases" in animation && Array.isArray(animation.phases)) {
    const sequence = animation as AnimationSequence;
    for (const phase of sequence.phases) {
      // Check abort between phases
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      await playPhase(map, phase, signal);
    }
  } else {
    // If it's a single phase, execute it directly
    await playPhase(map, animation as AnimationPhase, signal);
  }
}

/**
 * Play a single animation phase
 * Returns a promise that resolves when the phase completes
 * @param map - Mapbox GL map instance
 * @param phase - Animation phase to play
 * @param signal - Optional AbortSignal for cancellation
 */
async function playPhase(
  map: MapboxGLMap,
  phase: AnimationPhase,
  signal?: AbortSignal,
): Promise<void> {
  if (phase.type === "flyTo") {
    return playFlyTo(map, phase.options, signal);
  }
  if (phase.type === "easeTo") {
    return playEaseTo(map, phase.options, signal);
  }
  if (phase.type === "fitBounds") {
    return playFitBounds(map, phase.options, signal);
  }
  if (phase.type === "followPath") {
    return playFollowPath(map, phase.options, signal);
  }
  if (phase.type === "animatePoint") {
    return playAnimatePoint(map, phase.options, signal);
  }
  if (phase.type === "animatePath") {
    return playAnimatePath(map, phase.options, signal);
  }
  if (phase.type === "animateRoute") {
    return playAnimateRoute(map, phase.options, signal);
  }
  if (phase.type === "wait") {
    return playWait(phase.duration, signal);
  }
  if (phase.type === "custom") {
    return phase.fn(map);
  }
  if (phase.type === "rotateAroundPoint") {
    return playRotateAroundPoint(map, phase.options, signal);
  }
  if (phase.type === "sync") {
    return playSync(
      map,
      phase.phases,
      (m: MapboxGLMap, p: AnimationPhase, sig?: AbortSignal) =>
        playPhase(m, p, sig),
      signal,
    );
  }

  // Exhaustive check
  const _exhaustive: never = phase;
  return _exhaustive;
}
