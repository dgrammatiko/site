/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const { existsSync } = require('fs');
const { dirname } = require('path');
const { sync } = require('glob');
const paths = require('../paths.js');
const { mkdirSync } = require('fs-extra');
const buildImages = require('../add/responsive-images.js');

sync(`./${paths.staticSrc}/img/**/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const xPath = dirname(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`));
  if (!existsSync(xPath)) mkdirSync(xPath);

  buildImages(file);
})
