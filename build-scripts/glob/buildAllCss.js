/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const Path = require('path');
const glob = require('glob');
const { addCssFile } = require('../add/buildCssFile.js');
const paths = require('../paths');
const mkdirp = require('mkdirp');

glob.sync(`./${paths.buildSrc}/_assets/css/**/*.css`).forEach((file) => {
  if (Path.parse(file).base.match(/^_/)) { return; }
  console.log('Processing:', file)

  const xPath = Path.dirname(file.replace(`${paths.buildSrc}`, `${paths.buildDest}`));
  if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

  addCssFile(file)
  console.log(file)
});
