import download from "downloadjs";
import { toSvg as htmlToSvg } from "html-to-image";

type Format = {
  height?: number;
  width?: number;
};

type ToSvgProps = {
  format?: Format;
  name: string;
  node: HTMLElement;
};

async function toSvg({ node, name, format }: ToSvgProps): Promise<void> {
  await Promise.resolve();
  const data = await htmlToSvg(node, {
    canvasWidth: format?.width,
    canvasHeight: format?.height,
  });
  return download(data, name, "image/svg+xml");
}

export { toSvg };
