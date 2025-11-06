import type { Map as MapboxGLMap } from "mapbox-gl";

import type { AnimationPhase, AnimationSequence } from "./types";

/**
 * Manages animation execution with support for play, pause, resume, stop, and replay.
 * Handles AbortSignal for clean cancellation and elapsed time tracking for pause/resume.
 */
export class AnimationController {
  private map: MapboxGLMap;
  private abortController: AbortController;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private pausedTime: number = 0;
  private startTime: number = 0;
  private currentAnimation: AnimationSequence | AnimationPhase | null = null;

  constructor(map: MapboxGLMap) {
    this.map = map;
    this.abortController = new AbortController();
  }

  /**
   * Play an animation sequence or single phase
   * @param animation - Animation to play
   * @param onProgress - Callback with elapsed time (ms) during animation
   * @returns Promise that resolves when animation completes naturally
   * @throws DOMException with "AbortError" if animation is aborted
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
    this.isPaused = false;
    this.startTime = performance.now();

    try {
      // Import here to avoid circular dependency
      const { playAnimation } = await import("./player");

      // Create progress tracking interval
      const progressInterval = setInterval(() => {
        if (this.isPlaying && !this.isPaused) {
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
      this.isPaused = false;

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
   * Pause the currently playing animation
   * Captures elapsed time for resume
   */
  pause(): void {
    if (!this.isPlaying || this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.pausedTime = performance.now() - this.startTime;
  }

  /**
   * Resume a paused animation from where it was paused
   */
  resume(): void {
    if (!this.isPaused) {
      return;
    }

    this.isPaused = false;
    // Adjust startTime so that elapsed time continues from pausedTime
    this.startTime = performance.now() - this.pausedTime;
  }

  /**
   * Stop the animation and reset everything
   * Cleans up any pending operations
   */
  stop(): void {
    // Abort the animation
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }

    // Reset state
    this.isPlaying = false;
    this.isPaused = false;
    this.pausedTime = 0;
    this.startTime = 0;
    this.currentAnimation = null;

    // Create new abort controller for next animation
    this.abortController = new AbortController();
  }

  /**
   * Replay the animation from the beginning
   * Must be called after animation has completed
   */
  async replay(): Promise<void> {
    if (!this.currentAnimation) {
      throw new Error("No animation to replay");
    }

    this.stop();

    // Replay the same animation
    return this.play(this.currentAnimation);
  }

  /**
   * Get the current status of the animation
   */
  getStatus(): {
    elapsedTime: number;
    isPaused: boolean;
    isPlaying: boolean;
  } {
    let elapsedTime = this.pausedTime;

    if (this.isPlaying && !this.isPaused) {
      elapsedTime = performance.now() - this.startTime;
    }

    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      elapsedTime,
    };
  }
}
