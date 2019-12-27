/**
  * Build script
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const Path = require('path');
const glob = require('glob');
const paths = require('./paths');
const sharp = require('sharp');
const mkdirp = require('mkdirp');
const sizes = [320, 480, 768, 992, 1200, 1600, 1920];

glob.sync(`./${paths.buildSrc}/_assets/img/**/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const xPath = Path.dirname(file.replace(`${paths.buildSrc}`, `${paths.buildDest}`));
  if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

  sizes.forEach(size => {
    const newFile = file.replace(`${paths.buildSrc}`, `${paths.buildDest}`).replace('.png', `@${size}.png`).replace('.jpg', `@${size}.jpg`)
    const newFile2 = file.replace(`${paths.buildSrc}`, `${paths.buildDest}`).replace('.png', `@${size}.webp`).replace('.jpg', `@${size}.webp`)

    sharp(file)
      .resize(size)
      .toBuffer()
      .then(data => {
        fs.writeFileSync(newFile, data);
      })
      .catch(err => {
        console.log(err);
      });

    sharp(file)
      .resize(size)
      .toBuffer()
      .then(data => {
        fs.writeFileSync(newFile2, data);
      })
      .catch(err => {
        console.log(err);
      });
  });
})
