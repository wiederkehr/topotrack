import download from "downloadjs";
import { toPng as htmlToPng } from "html-to-image";

export async function toPng({ node, name }) {
  return Promise.resolve()
    .then(() => htmlToPng(node, { pixelRatio: 2 }))
    .then((data) => download(data, name, "image/png"));
}
