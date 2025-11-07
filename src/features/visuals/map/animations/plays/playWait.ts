/**
 * Wait for specified duration
 *
 * @param duration - Duration to wait in milliseconds
 * @param signal - Optional AbortSignal for cancellation
 * @returns Promise that resolves after the specified duration
 *
 * @example
 * await playWait(500); // Wait 500ms
 */
export async function playWait(
  duration: number,
  signal?: AbortSignal,
): Promise<void> {
  // Check if abort was requested before starting
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve();
    }, duration);

    // Listen for abort signal
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
