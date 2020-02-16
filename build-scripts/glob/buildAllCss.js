/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  */
const { existsSync } = require('fs');
const { parse, dirname } = require('path');
const { sync } = require('glob');
const { addCssFile } = require('../add/buildCssFile.js');
const paths = require('../paths');
const { mkdirSync } = require('fs-extra');

sync(`./${paths.staticSrc}/css/**/*.css`).forEach((file) => {
  if (parse(file).base.match(/^_/)) { return; }
  console.log('Processing:', file)

  const xPath = dirname(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`));
  if (!existsSync(xPath)) mkdirSync(xPath);

  addCssFile(file)
});
