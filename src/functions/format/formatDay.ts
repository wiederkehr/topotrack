const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

function formatMonthDay(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return formatter.format(date);
}

export { formatMonthDay };
