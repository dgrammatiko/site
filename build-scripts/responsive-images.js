/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const { existsSync, writeFileSync } = require('fs');
const { dirname } = require('path');
const { sync } = require('glob');
const paths = require('./paths');
const sharp = require('sharp');
const { mkdirSync } = require('fs-extra');
const sizes = [320, 480, 768, 992, 1200, 1600, 1920];

sync(`./${paths.staticSrc}/img/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const xPath = dirname(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`));
  if (!existsSync(xPath)) mkdirSync(xPath);

  sizes.forEach(size => {
    const newFile = file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.png`).replace('.jpg', `@${size}.jpg`)
    const newFile2 = file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@${size}.webp`).replace('.jpg', `@${size}.webp`)

    sharp(file)
      .resize(size)
      .toBuffer()
      .then(data => {
        writeFileSync(newFile, data);
      })
      .catch(err => {
        console.log(err);
      });

    sharp(file)
      .resize(size)
      .toBuffer()
      .then(data => {
        writeFileSync(newFile2, data);
      })
      .catch(err => {
        console.log(err);
      });
  });
})
