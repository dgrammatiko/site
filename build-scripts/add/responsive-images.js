/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const paths = require('../paths.js');
const sharp = require('sharp');
const sizes = require('../sizes.js');

module.exports.buildImages = function (originalImage) {
  sizes.forEach(size => {
    const newFile = originalImage.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.png`).replace('.jpg', `@${size}.jpg`)
    const newFile2 = originalImage.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.webp`).replace('.jpg', `@${size}.webp`)

    sharp(originalImage)
      .resize(size)
      .toBuffer()
      .then(data => {
        fs.writeFileSync(newFile, data);
      })
      .catch(err => {
        console.log(err);
      });

    sharp(originalImage)
      .resize(size)
      .toBuffer()
      .then(data => {
        fs.writeFileSync(newFile2, data);
      })
      .catch(err => {
        console.log(err);
      });
  });
};
