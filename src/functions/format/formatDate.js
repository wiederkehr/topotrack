export default function formatDate(dateString) {
  const date = new Date(Date.parse(dateString));
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
