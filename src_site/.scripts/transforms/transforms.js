const { parseHTML } = require('linkedom');
const { writeFile, ensureDir } = require('fs-extra');
const htmlmin = require('html-minifier');

const root = process.cwd();

module.exports = {
  minifyHTML: (content, outputPath)  => {
    if (
      outputPath.endsWith(".html") &&
      ![
        `${root}/live/index-top.html`,
        `${root}/live/index-bottom.html`,
      ].includes(outputPath)
    ) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    } else if (
      [
        `${root}/live/index-top.html`,
        `${root}/live/index-bottom.html`,
      ].includes(outputPath)
    ) {
      return content.replace(/>\s*\n\s*</g, "><");
    }
    return content;
  },
  createBodyPart: async (value, outputPath) => {
    if (outputPath.endsWith('.html')) {
      let { document } = parseHTML(value);

      if (![`${root}/live/index-top.html`, `${root}/live/index-bottom.html`, `${root}/live/offline.html`].includes(outputPath)) {
        await ensureDir(outputPath.replace('/index.html', ''))
      }

      // index-top
      if (`${root}/live/index-top.html` === outputPath) {
        return document.documentElement.outerHTML.replace(/<\/header>\?.*/, '</header>').replace('</body></html>', '');
      }
      if (`${root}/live/index-bottom.html` === outputPath) {
        return document.documentElement.outerHTML.replace('<!DOCTYPE html><html><head></head><body>', '');
      }

      const main = document.querySelector('main');

      if (main) {
        await writeFile(outputPath.replace('.html', '.content.html'), `${main.outerHTML}`, {encoding: 'utf8'});
      }

      return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
    }

    return value;
  }
}
