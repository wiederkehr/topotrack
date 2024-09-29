import download from "downloadjs";
import { toSvg as htmlToSvg } from "html-to-image";

export async function toSvg({ node, name }) {
  return Promise.resolve()
    .then(() => htmlToSvg(node))
    .then((data) => download(data, name, "image/svg+xml"));
}
