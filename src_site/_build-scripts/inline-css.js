const {existsSync, mkdirp, readFile, readFileSync } = require('fs-extra');
const crypto = require('crypto');
const {dirname} = require('path');
const {execSync} = require('child_process');
const decode = require('decode-html');
const paths = require('./paths');

module.exports.translateInlineStyles = async function(document) {
  const wannaBeStyles = [...document.querySelectorAll('wanna-be-inline-style')];

  if (!wannaBeStyles.length) return document;

  const styleEl = document.createElement('style');

  for await (let stl of wannaBeStyles) {
    const style = styleEl.cloneNode(true);
    let srcs = stl.getAttribute('src').split(',');

    let existingStyles = decode(stl.innerHTML);

    for await (let src of srcs) {
      // await processPcss(`${process.cwd()}/src_assets/${src}`)
      existingStyles = existingStyles + await readFile(`${process.cwd()}/live/${src}`, {encoding: 'utf8'});
    }

    style.innerHTML = existingStyles;

    const hash = crypto.createHash('sha256');
    hash.update(style.innerHTML);
    style.nonce = `sha256-${hash.digest('hex')}`;

    stl.replaceWith(style);
  }

  return document;
}
