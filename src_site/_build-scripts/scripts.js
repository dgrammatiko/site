const {exists, existsSync, mkdirp, mkdirpSync, readFile, readFileSync } = require('fs-extra');
const crypto = require('crypto');
const {dirname} = require('path');
const {execSync} = require('child_process');
const paths = require('./paths');

module.exports.translateScripts = async function(document) {
  const wannaBeScripts = [...document.querySelectorAll('wanna-be-script')];

  if (!wannaBeScripts.length) return document;

  const scriptEl = document.createElement('script');

  wannaBeScripts.forEach(async wannaBeScript => {
    let srcO = wannaBeScript.getAttribute('src');

    const script = scriptEl.cloneNode(true);

    for (let attr of wannaBeScript.attributes) {
      script[attr.name] = attr.value;
    }

    for (let dt in wannaBeScript.dataset) {
      script.setAttribute(`data-${paramCase(dt)}`, wannaBeScript.dataset[dt]);
    }

    script.src = rollup(srcO);

    const hash = crypto.createHash('sha256');
    hash.update(readFileSync(`${paths.siteDest}${srcO}`, {encoding: 'utf8'}));
    script.nonce = `sha256-${hash.digest('hex')}`;

    wannaBeScript.replaceWith(script);
  });

  return document;
}

function rollup(file) {
  if (file === '/static/js/ce-theme-switcher.esm.js') {
    if (!existsSync(`${process.cwd()}/${paths.staticDest}/js/ce-theme-switcher.esm.js`)) {
      if (!existsSync(`${process.cwd()}/${paths.staticDest}/js`)) mkdirpSync(`${paths.staticDest}/js`);

        execSync(`./node_modules/.bin/rollup ./node_modules/ce-theme-switcher/src/index.js -o ./live${file}`);

      return '/static/js/ce-theme-switcher.esm.js?' + Math.random(32)
    }

    return '/static/js/ce-theme-switcher.esm.js?' + Math.random(32)
  }

  return file;
}
