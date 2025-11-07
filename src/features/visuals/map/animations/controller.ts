import type { Map as MapboxGLMap } from "mapbox-gl";

import type { AnimationPhase, AnimationSequence } from "./types";

/**
 * Manages animation execution with support for play and stop.
 * Handles AbortSignal for clean cancellation and progress tracking.
 */
export class AnimationController {
  private map: MapboxGLMap;
  private abortController: AbortController;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private currentAnimation: AnimationSequence | AnimationPhase | null = null;

  constructor(map: MapboxGLMap) {
    this.map = map;
    this.abortController = new AbortController();
  }

  /**
   * Play an animation sequence or single phase from the beginning
   * @param animation - Animation to play
   * @param onProgress - Optional callback with elapsed time (ms) during animation
   * @returns Promise that resolves when animation completes naturally
   * @throws DOMException with "AbortError" if animation is aborted via stop()
   */
  async play(
    animation: AnimationSequence | AnimationPhase,
    onProgress?: (elapsedTime: number) => void,
  ): Promise<void> {
    // If already playing, ignore
    if (this.isPlaying) {
      return;
    }

    // Check if abort was requested before we even start
    if (this.abortController.signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    this.currentAnimation = animation;
    this.isPlaying = true;
    this.startTime = performance.now();

    try {
      // Import here to avoid circular dependency
      const { playAnimation } = await import("./player");

      // Create progress tracking interval
      const progressInterval = setInterval(() => {
        if (this.isPlaying) {
          const elapsed = performance.now() - this.startTime;
          onProgress?.(elapsed);
        }
      }, 16); // ~60fps

      try {
        // Execute animation with abort signal
        await playAnimation(this.map, animation, this.abortController.signal);

        // Animation completed naturally
        const finalElapsed = performance.now() - this.startTime;
        onProgress?.(finalElapsed);
      } finally {
        clearInterval(progressInterval);
      }

      this.isPlaying = false;
    } catch (error) {
      this.isPlaying = false;

      // Re-throw abort errors
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      // Log other errors
      console.error("Animation execution error:", error);
      throw error;
    }
  }

  /**
   * Stop the animation and reset everything
   * Aborts the current animation and cleans up state
   */
  stop(): void {
    console.log(
      "[AnimationController] Stopping animation, isPlaying:",
      this.isPlaying,
    );
    // Abort the animation
    if (!this.abortController.signal.aborted) {
      console.log("[AnimationController] Aborting signal");
      this.abortController.abort();
    }

    // Reset state
    this.isPlaying = false;
    this.startTime = 0;
    this.currentAnimation = null;

    // Create new abort controller for next animation
    this.abortController = new AbortController();
  }

  /**
   * Get the current playing status
   */
  isRunning(): boolean {
    return this.isPlaying;
  }
}
