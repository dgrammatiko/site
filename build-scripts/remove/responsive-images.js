/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const { unlinkSync } = require('fs');
const paths = require('../paths.js');
const sizes = require('../sizes.js');

module.exports.buildImages = function (originalImage) {
  sizes.forEach(size => {
    const newFile = originalImage.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.png`).replace('.jpg', `@${size}.jpg`)
    const newFile2 = originalImage.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.webp`).replace('.jpg', `@${size}.webp`)

    unlinkSync(newFile);
    unlinkSync(newFile2);
  });
};
