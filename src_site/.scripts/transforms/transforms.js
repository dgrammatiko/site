import { parseHTML } from 'linkedom';
import pkg from 'fs-extra';
import htmlnano from 'htmlnano';

const { writeFile, ensureDir } = pkg;
const root = process.cwd();

const options = {
  // removeEmptyAttributes: false, // Disable the module "removeEmptyAttributes"
  collapseWhitespace: 'conservative', // Pass options to the module "collapseWhitespace"
};
const postHtmlOptions = {
  lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
  quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
};

export default {
  minifyHTML: async (content, outputPath) => {
    if (outputPath.endsWith('.html') && ![`${root}/live/index-top.html`, `${root}/live/index-bottom.html`].includes(outputPath)) {
      try {
        const result = await htmlnano.process(content, options, htmlnano.presets.safe, postHtmlOptions);
        return result.html;
      } catch (err) {
        console.error(err);
      }
    }
    if ([`${root}/live/index-top.html`, `${root}/live/index-bottom.html`].includes(outputPath)) {
      return content.replace(/>\s*\n\s*</g, '><');
    }
    return content;
  },
  // createBodyPart: async (value, outputPath) => {
  //   if (outputPath.endsWith('.html')) {
  //     const { document } = parseHTML(value);

  //     if (![`${root}/live/index-top.html`, `${root}/live/index-bottom.html`, `${root}/live/offline.html`].includes(outputPath)) {
  //       await ensureDir(outputPath.replace('/index.html', ''));
  //     }

  //     // index-top
  //     if (`${root}/live/index-top.html` === outputPath) {
  //       return document.documentElement.outerHTML.replace(/<\/header>\?.*/, '</header>').replace('</body></html>', '');
  //     }
  //     if (`${root}/live/index-bottom.html` === outputPath) {
  //       return document.documentElement.outerHTML.replace('<!DOCTYPE html><html><head></head><body>', '');
  //     }

  //     const main = document.querySelector('main');

  //     if (main) {
  //       await writeFile(outputPath.replace('.html', '.content.html'), `${main.outerHTML}`, { encoding: 'utf8' });
  //     }

  //     return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
  //   }

  //   return value;
  // },
};
