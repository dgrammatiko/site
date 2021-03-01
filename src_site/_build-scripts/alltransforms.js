const {parseHTML} = require('linkedom');
const {writeFile, ensureDir } = require('fs-extra');

const { siteDest } = require('./paths');
const root = process.cwd();

module.exports = async function (value, outputPath) {
    if (outputPath.endsWith('.html')) {
        let { document } = parseHTML(value);

        if (![`${root}/${siteDest}/index-top.html`, `${root}/${siteDest}/index-bottom.html`, `${root}/${siteDest}/offline.html`].includes(outputPath)) {
          await ensureDir(outputPath.replace('/index.html', ''))
        }

        // index-top
        if (`${root}/${siteDest}/index-top.html` === outputPath) {
          return document.documentElement.outerHTML.replace(/<\/header>\?.*/, '</header>').replace('</body></html>', '');
        }
        if (`${root}/${siteDest}/index-bottom.html` === outputPath) {
          return document.documentElement.outerHTML.replace('<!DOCTYPE html><html><head></head><body>', '');
        }

        const main = document.querySelector('main');

        if (main) {
          await writeFile(outputPath.replace('.html', '.content.html'), `${main.outerHTML}`, {encoding: 'utf8'});
        }

        return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
    }
    return value;
};
