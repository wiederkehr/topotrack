type Dimensions = {
  height: number;
  width: number;
};

function stringifyDimensions(dimensions: Dimensions): string {
  return `(${dimensions.width}×${dimensions.height})`;
}

export { stringifyDimensions };