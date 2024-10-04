import kebabCase from "voca/kebab_case";
import slugify from "voca/slugify";

export default function formatFilename({ date, name, format, type }) {
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
    type
  );
  return filename;
}

const formatDate = (date) => {
  const date = new Date(Date.parse(date));
  return date.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '');
};

const formatName = (name) => {
  return slugify(name);
};

const formatFormat = (format) => {
  return kebabCase(format);
};
