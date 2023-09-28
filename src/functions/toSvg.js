// Simplified version of toSvg from html-to-image
export async function toSvg(node) {
  return Promise.resolve()
    .then(() => new XMLSerializer().serializeToString(node))
    .then(encodeURIComponent)
    .then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
