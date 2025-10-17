function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  // Show days only if >= 24 hours
  if (seconds >= 86400) {
    parts.push(days.toString().padStart(2, "0"));
  }

  // Show hours only if >= 60 minutes
  if (seconds >= 3600) {
    parts.push(hours.toString().padStart(2, "0"));
  }

  // Always show minutes and seconds
  parts.push(minutes.toString().padStart(2, "0"));
  parts.push(secs.toString().padStart(2, "0"));

  return parts.join(":");
}

export { formatTime };
