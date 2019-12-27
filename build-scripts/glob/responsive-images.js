/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const Path = require('path');
const glob = require('glob');
const paths = require('../paths.js');
const mkdirp = require('mkdirp');
const buildImages = require('../add/responsive-images.js');

glob.sync(`./${paths.buildSrc}/_assets/img/**/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const xPath = Path.dirname(file.replace(`${paths.buildSrc}`, `${paths.buildDest}`));
  if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

  buildImages(file);
})
