import download from "downloadjs";
import { toPng as htmlToPng } from "html-to-image";

export async function toPng({ node, name, format }) {
  return Promise.resolve()
    .then(() =>
      htmlToPng(node, {
        pixelRatio: 2,
        canvasWidth: format?.width,
        canvasHeight: format?.height,
      }),
    )
    .then((data) => download(data, name, "image/png"));
}
