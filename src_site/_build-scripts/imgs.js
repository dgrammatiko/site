const { camelCase, paramCase } =require("change-case");
const { exists, writeFile, mkdirp, existsSync } = require('fs-extra');
const { dirname, extname } = require('path');
const sharp = require('sharp');

const paths = require('./paths');
const sizes = [160, 320, 480, 640, 800, 960, 1200, 1600, 1920];

module.exports.translateImages = async function (document) {
  const wannaBePictures = [...document.querySelectorAll('wanna-be-picture')];

  if (!wannaBePictures.length) {
    return document;
  }

  const figureEl = document.createElement('figure');
  const pictureEl = document.createElement('picture');
  const sourceEl = document.createElement('source');
  const imgEl = document.createElement('img');

  wannaBePictures.forEach(async wannaBePic => {
    const src = wannaBePic.getAttribute('src');

    await prepareImage(`${process.cwd()}/src_assets${src}`);

    const picture = pictureEl.cloneNode(true);
    const figure = figureEl.cloneNode(true);

    let sizes = wannaBePic.getAttribute('sizes').split(',');
    sizes = sizes.map(s => parseInt(s, 10)).sort((a,b)=>b-a);
    const path = `${process.cwd()}/live${src}`;
    const ext = extname(`${process.cwd()}/src_assets${src}`);

    for (let size of sizes) {
      const source = sourceEl.cloneNode(true);
      source.type = `image/${ext.replace('.', '')}`;
      source.media = `(min-width:${size}px)`;
      source.srcset = `${path.replace(`${ext}`, `@${size}${ext}`).replace(`${process.cwd()}/live`, '')}`;
      const webp = source.cloneNode(true);
      webp.type = `image/webp`;
      webp.media = `(min-width:${size}px)`;
      webp.srcset = `${path.replace(`${ext}`, `@${size}.webp`).replace(`${process.cwd()}/live`, '')}`;

      picture.appendChild(source);
      picture.appendChild(webp);
    }

    const img = imgEl.cloneNode(true);

    for (let attr of wannaBePic.attributes) {
      img[attr.name] = attr.value;
    }

    for (let dt in wannaBePic.dataset) {
      img.setAttribute(`data-${paramCase(dt)}`, wannaBePic.dataset[dt]);
    }

    img.setAttribute('src', `${path.replace(`${ext}`, `@${sizes[0]}${ext}`).replace(`${process.cwd()}/live`, '')}`);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('style', 'position:absolute;top:0;left:0;width:100%')
    figure.setAttribute('style', 'display:block;position:relative;padding-top: 56.25%;')

    picture.appendChild(img);
    figure.appendChild(picture);

    wannaBePic.replaceWith(figure);
  });

  return document;
}

async function prepareImage(file) {
  if (!existsSync(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.png', `@320.png`).replace('.jpg', `@320.jpg`))) {
    const livePath = dirname(`${process.cwd()}/${file.replace(`${paths.staticSrc}/static`, `${paths.staticDest}`)}`);
    // const packagePath = dirname(file.replace(`${paths.staticSrc}`, `${paths.staticDest}`));
    if (!existsSync(livePath)) await mkdirp(livePath);
    // if (! await exists(packagePath)) await mkdir(packagePath);

    await sizes.forEach(async size => {
      const newFile = `${process.cwd()}/${file.replace(`${paths.staticSrc}/static`, `${paths.staticDest}`).replace('.png', `@${size}.png`).replace('.jpg', `@${size}.jpg`)}`
      const newFile2 = `${process.cwd()}/${file.replace(`${paths.staticSrc}/static`, `${paths.staticDest}`).replace('.png', `@${size}.webp`).replace('.jpg', `@${size}.webp`)}`

      await sharp(`${process.cwd()}/${file.replace('/static', '')}`)
      .resize(size)
      .toBuffer()
      .then(async data => {
        await writeFile(newFile, data);
        await writeFile(newFile2, data);
      })
      .catch(err => {
        console.log(err);
      });

    });
  }
}
