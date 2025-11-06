import type { Map as MapboxGLMap } from "mapbox-gl";

import type { AnimationPhase } from "./types";

/**
 * Play synchronized animations in parallel
 * All child animations execute concurrently with independent durations
 *
 * @param map - Mapbox GL map instance
 * @param phases - Array of animation phases to execute in parallel
 * @param playPhase - Function to play a single phase (dependency injection)
 * @returns Promise that resolves when all animations complete
 *
 * @example
 * await playSync(map, [
 *   { type: 'flyTo', options: { center: [0, 0] } },
 *   { type: 'wait', duration: 500 }
 * ], playPhase);
 */
export async function playSync(
  map: MapboxGLMap,
  phases: AnimationPhase[],
  playPhase: (map: MapboxGLMap, phase: AnimationPhase) => Promise<void>,
): Promise<void> {
  // Create promises for all child phases and execute them in parallel
  const promises: Promise<void>[] = [];

  for (const phase of phases) {
    promises.push(playPhase(map, phase));
  }

  // Wait for all animations to complete
  await Promise.all(promises);
}
