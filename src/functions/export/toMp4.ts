import download from "downloadjs";

type ToMp4Props = {
  blob: Blob;
  format?: string;
  name: string;
};

async function toMp4({ blob, name, format }: ToMp4Props): Promise<void> {
  await Promise.resolve();
  return download(blob, name, "video/mp4");
}

export { toMp4 };
