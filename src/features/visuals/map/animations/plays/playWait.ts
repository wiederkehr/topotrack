/**
 * Wait for specified duration
 *
 * @param duration - Duration to wait in milliseconds
 * @returns Promise that resolves after the specified duration
 *
 * @example
 * await playWait(500); // Wait 500ms
 */
export async function playWait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
