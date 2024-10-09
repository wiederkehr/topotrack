import download from "downloadjs";

export async function toMp4({ blob, name }) {
  return Promise.resolve().then(() => download(blob, name, "video/mp4"));
}
