import kebabCase from "voca/kebab_case";
import slugify from "voca/slugify";

type FormatFilenameProps = {
  date: string;
  format: string;
  name: string;
  type: string;
};

function formatFilename({
  date,
  name,
  format,
  type,
}: FormatFilenameProps): string {
  const application = "topotrack";
  const d = "-";
  const p = ".";
  const filename = "".concat(
    application,
    d,
    formatDate(date),
    d,
    formatName(name),
    d,
    formatFormat(format),
    p,
    type,
  );
  return filename;
}

function formatDate(dateString: string): string {
  const date = new Date(Date.parse(dateString));
  return date
    .toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "");
}

function formatName(name: string): string {
  return slugify(name);
}

function formatFormat(format: string): string {
  return kebabCase(format);
}

export { formatFilename };
