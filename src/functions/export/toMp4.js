import download from "downloadjs";

export async function toMp4({ blob, name, format }) {
  return Promise.resolve().then(() => download(blob, name, "video/mp4"));
}
