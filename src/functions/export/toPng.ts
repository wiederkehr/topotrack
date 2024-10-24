import download from "downloadjs";
import { toPng as htmlToPng } from "html-to-image";

type Format = {
  height?: number;
  width?: number;
};

type ToPngProps = {
  format?: Format;
  name: string;
  node: HTMLElement;
};

async function toPng({ node, name, format }: ToPngProps): Promise<void> {
  await Promise.resolve();
  const data = await htmlToPng(node, {
    pixelRatio: 2,
    canvasWidth: format?.width,
    canvasHeight: format?.height,
  });
  return download(data, name, "image/png");
}

export { toPng };
