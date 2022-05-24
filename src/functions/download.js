import { csvFormat } from 'd3';
import { downloadPng, downloadSvg } from 'svg-crowbar';

// Download data
export const downloadCSV = (data, name = 'download') => {
  const prefix = 'data:text/csv;charset=utf-8,';
  const content = encodeURIComponent(csvFormat(data));
  const href = prefix + content;
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', href);
  downloadAnchorNode.setAttribute('download', name + '.csv');
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const downloadJSON = (data, name = 'download') => {
  const prefix = 'data:text/json;charset=utf-8,';
  const content = encodeURIComponent(JSON.stringify(data));
  const href = prefix + content;
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', href);
  downloadAnchorNode.setAttribute('download', name + '.json');
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

// Download images
export const downloadPNG = (element, name, options) => {
  downloadPng(document.querySelector(element), name, options);
};

export const downloadSVG = (element, name, options) => {
  downloadSvg(document.querySelector(element), name, options);
};
