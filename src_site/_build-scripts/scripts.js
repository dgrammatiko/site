const {exists, existsSync, mkdirp, readFile, readFileSync } = require('fs-extra');
const crypto = require('crypto');
const {dirname} = require('path');
const {execSync} = require('child_process');
const paths = require('./paths');

module.exports.translateScripts = async function(document) {
  const wannaBeScripts = [...document.querySelectorAll('wanna-be-script')];

  if (!wannaBeScripts.length) return document;

  const scriptEl = document.createElement('script');

  wannaBeScripts.forEach(async wannaBeScript => {
    let src = wannaBeScript.getAttribute('src');

    const script = scriptEl.cloneNode(true);

    for (let attr of wannaBeScript.attributes) {
      script[attr.name] = attr.value;
    }

    for (let dt in wannaBeScript.dataset) {
      script.setAttribute(`data-${paramCase(dt)}`, wannaBeScript.dataset[dt]);
    }

    script.src =  await rollup(src);// Hash it

    wannaBeScript.replaceWith(script);
  });

  return document;
}

async function rollup(file) {
  if (file === '/static/js/ce-theme-switcher.esm.js') {
    if (! await exists(`${paths.staticDest}/js/ce-theme-switcher.esm.js`)) {
      if (! await exists(`${paths.staticDest}/js`)) await mkdirp(`${paths.staticDest}/js`);
      await execSync(`./node_modules/.bin/rollup ./node_modules/ce-theme-switcher/src/index.js -o ./live${file}`);

      return '/static/js/ce-theme-switcher.esm.js?' + Math.random(32)
    }

    return '/static/js/ce-theme-switcher.esm.js?' + Math.random(32)
  }

  return file;
}
