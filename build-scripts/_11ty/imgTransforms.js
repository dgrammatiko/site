const { JSDOM } = require('jsdom');
const sizeOf = require('image-size');
const {extname} = require('path');
const {exists, existsSync, mkdirp, writeFile } = require('fs-extra');
const { camelCase, paramCase } =require("change-case");
const {translateImages} = require('./imgs');
const {translateInlineStyles} = require('./inlineCss');
const {translateInlineJs} = require('./inlineJS');
const {translateScripts} = require('./scripts');

const { siteSrc, siteDest } = require('../paths');
const root = process.cwd();

module.exports = async function (value, outputPath) {
    if (outputPath.endsWith('.html')) {
        const DOM = new JSDOM(value, {
            resources: 'usable'
        });

        let document = DOM.window.document;

        document = await translateImages(document);
        document = await translateInlineStyles(document);
        document = await translateInlineJs(document);
        document = await translateScripts(document);

        if (![`${root}/${siteDest}/index-top.html`, `${root}/${siteDest}/index-bottom.html`, `${root}/${siteDest}/offline.html`].includes(outputPath) && !(await exists(outputPath.replace('/index.html', '')))) {
          await mkdirp(outputPath.replace('/index.html', ''))
        }

        // index-top
        if (`${root}/${siteDest}/index-top.html` === outputPath) {
          return document.documentElement.outerHTML.replace(/<\/header>\?.*/, '</header>').replace('</body></html>', '') //[^|]*$
        }
        if (`${root}/${siteDest}/index-bottom.html` === outputPath) {
          return document.documentElement.outerHTML.replace('<!DOCTYPE html><html><head></head><body>', '') //[^|]*$
        }

        if (document.querySelector('main')) {
          let documentNew = document.cloneNode(true)
          // const toBeDeleted = [...documentNew.querySelectorAll('style, script')];
          // for (let iidx of toBeDeleted) {
          //   iidx.remove()
          // }
          const main = documentNew.querySelector('main');
          await writeFile(outputPath.replace('.html', '.content.html'), `${main.outerHTML}`, {encoding: 'utf8'});
        }

        return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
    }
    return value;
};
