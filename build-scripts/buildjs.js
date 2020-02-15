/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const fs = require('fs');
const paths = require('./paths');
const Terser = require("terser");
const Path = require('path');
const mkdirp = require('mkdirp');
const fsExtra = require('fs-extra');

const xPath = Path.dirname(`${paths.staticDest}/js/io.js`);
if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

// fs.writeFileSync(`${paths.staticDest}/.nojekyll`, '', { encoding: 'utf8' });

// fs.writeFileSync(`${paths.staticDest}/CNAME`, 'site.dgrammatiko.online', { encoding: 'utf8' });

// fsExtra.copySync(`${paths.staticSrc}/js/validate.js`, `${paths.staticDest}/js/validate.js`);
// Cope with the contact script
if (fs.existsSync(`${paths.staticSrc}/js/validate.js`)) {
  const inp = fs.readFileSync(`${paths.staticSrc}/js/validate.js`, { encoding: 'utf8' });

  // intersection = Terser.minify(intersection);
  fs.writeFileSync(`${paths.staticDest}/js/validate.js`, Terser.minify(inp).code, { encoding: 'utf8' })
}

// Cope with the intersection-observer polyfill
if (fs.existsSync('node_modules/intersection-observer/intersection-observer.js')) {
  let intersection = fs.readFileSync('node_modules/intersection-observer/intersection-observer.js', { encoding: 'utf8' });

  intersection += `
document.dispatchEvent(new Event('intersection-observer-loaded', {'bubbles':true, 'cancelable':false}));`;

  // intersection = Terser.minify(intersection);
  fs.writeFileSync(`${paths.staticDest}/js/io-polyfill.js`, Terser.minify(intersection).code, { encoding: 'utf8' })
}

// Cope with the lazy-img script
if (fs.existsSync(`${paths.staticSrc}/js/lazyloadImgs.js`)) {
  const inp = fs.readFileSync(`${paths.staticSrc}/js/lazyloadImgs.js`, { encoding: 'utf8' });

  // intersection = Terser.minify(intersection);
  fs.writeFileSync(`${paths.staticDest}/js/lazyloadImgs.js`, Terser.minify(inp).code, { encoding: 'utf8' })
}
