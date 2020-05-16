const {exists, existsSync, mkdirp, readFile, readFileSync } = require('fs-extra');
const crypto = require('crypto');
const decode = require('decode-html');

module.exports.translateInlineJs = async function(document) {
  if (!document || !document.querySelectorAll) return document;
  const wannaBeScripts = [...document.querySelectorAll('wanna-be-inline-script')];

  if (!wannaBeScripts.length) return document;

  const scriptEl = document.createElement('script');

  wannaBeScripts.forEach(async stl => {
    const script = scriptEl.cloneNode(true);
    script.innerHTML = decode(stl.innerHTML);

    const hash = crypto.createHash('sha256');
    hash.update(script.innerHTML);
    script.nonce = `sha256-${hash.digest('hex')}`;

    stl.replaceWith(script);
  });

  return document;
}

