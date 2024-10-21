const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

export default function formatMonthDay(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return formatter.format(date);
}