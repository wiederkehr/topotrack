const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
});

function formatYear(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return formatter.format(date);
}

export { formatYear };
