function formatDate(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export { formatDate };
