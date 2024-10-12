import download from "downloadjs";
import { toSvg as htmlToSvg } from "html-to-image";

export async function toSvg({ node, name, format }) {
  return Promise.resolve()
    .then(() =>
      htmlToSvg(node, {
        canvasWidth: format?.width,
        canvasHeight: format?.height,
      }),
    )
    .then((data) => download(data, name, "image/svg+xml"));
}
