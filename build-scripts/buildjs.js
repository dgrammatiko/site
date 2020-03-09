/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const { existsSync, readFileSync, writeFileSync } = require('fs');
const paths = require('./paths');
const Terser = require("terser");
const { dirname } = require('path');
const { copySync, mkdirSync } = require('fs-extra');

const xPath = dirname(`${paths.staticDest}/js/io.js`);
if (!existsSync(xPath)) mkdirSync(xPath);

// writeFileSync(`${paths.staticDest}/.nojekyll`, '', { encoding: 'utf8' });

// writeFileSync(`${paths.staticDest}/CNAME`, 'site.dgrammatiko.online', { encoding: 'utf8' });

// copySync(`${paths.staticSrc}/js/validate.js`, `${paths.staticDest}/js/validate.js`);
// Cope with the contact script
if (existsSync(`${paths.staticSrc}/js/validate.js`)) {
  const inp = readFileSync(`${paths.staticSrc}/js/validate.js`, { encoding: 'utf8' });

  // intersection = Terser.minify(intersection);
  writeFileSync(`${paths.staticDest}/js/validate.js`, Terser.minify(inp).code, { encoding: 'utf8' })
}

// Cope with the intersection-observer polyfill
if (existsSync('node_modules/intersection-observer/intersection-observer.js')) {
  let intersection = readFileSync('node_modules/intersection-observer/intersection-observer.js', { encoding: 'utf8' });

  intersection += `
document.dispatchEvent(new Event('intersection-observer-loaded', {'bubbles':true, 'cancelable':false}));`;

  // intersection = Terser.minify(intersection);
  writeFileSync(`${paths.staticDest}/js/io-polyfill.js`, Terser.minify(intersection).code, { encoding: 'utf8' })
}

// Cope with the lazy-img script
if (existsSync(`${paths.staticSrc}/js/lazyloadImgs.js`)) {
  const inp = readFileSync(`${paths.staticSrc}/js/lazyloadImgs.js`, { encoding: 'utf8' });

  // intersection = Terser.minify(intersection);
  writeFileSync(`${paths.staticDest}/js/lazyloadImgs.js`, Terser.minify(inp).code, { encoding: 'utf8' })
}
