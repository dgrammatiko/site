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

glob.sync(`./${paths.staticSrc}/img/**/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const xPath = Path.dirname(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`));
  if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

  buildImages(file);
})
