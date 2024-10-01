import slugify from "voca/slugify";
import kebabCase from "voca/kebab_case";
import { format, parseISO } from "date-fns";

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
  return format(parseISO(date), "yyMMdd");
};

const formatName = (name) => {
  return slugify(name);
};

const formatFormat = (format) => {
  return kebabCase(format);
};
