const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
});

export default function formatYear(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return formatter.format(date);
}
