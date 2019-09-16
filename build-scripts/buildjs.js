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

const xPath = Path.dirname(`${paths.buildDest}/_assets/js/io.js`);
if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

fs.writeFileSync(`${paths.buildDest}/.nojekyll`, '', { encoding: 'utf8' });

fs.writeFileSync(`${paths.buildDest}/CNAME`, 'site.dgrammatiko.online', { encoding: 'utf8' });


// Cope with the intersection-observer polyfill
if (fs.existsSync('node_modules/intersection-observer/intersection-observer.js')) {
  let intersection = fs.readFileSync('node_modules/intersection-observer/intersection-observer.js', { encoding: 'utf8' });

  intersection += `
document.dispatchEvent(new Event('intersection-observer-loaded', {'bubbles':true, 'cancelable':false}));`;

  // intersection = Terser.minify(intersection);
  fs.writeFileSync(`${paths.buildDest}/_assets/js/io-polyfill.js`, Terser.minify(intersection).code, { encoding: 'utf8' })
}

// Cope with the lazy-img script
if (fs.existsSync(`${paths.buildSrc}/_assets/js/lazyloadImgs.js`)) {
  const inp = fs.readFileSync(`${paths.buildSrc}/_assets/js/lazyloadImgs.js`, { encoding: 'utf8' });

  // intersection = Terser.minify(intersection);
  fs.writeFileSync(`${paths.buildDest}/_assets/js/lazyloadImgs.js`, Terser.minify(inp).code, { encoding: 'utf8' })
}
