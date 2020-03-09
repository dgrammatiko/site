const jsDom = require('@tbranyen/jsdom');
const { JSDOM } = jsDom;
const sizeOf = require('image-size');
const Fs = require('fs');
const FsExtra = require('fs-extra');
const path = require('path');
const root = process.cwd();

module.exports = function (value, outputPath) {
    if (outputPath.endsWith('.html')) {
        const DOM = new JSDOM(value, {
            resources: 'usable'
        });

        const document = DOM.window.document;
        const articleImages = [...document.querySelectorAll('img')];
        const main = document.querySelector('main');

        if (articleImages.length) {
            articleImages.forEach(image => {
                if (!image.getAttribute('data-src')) return;
                const path = `${process.cwd()}/src${image.getAttribute('data-src').replace('@480', '').replace('@320', '')}`;
                if (existsSync(path)) {
                    const dimensions = sizeOf(path);
                    const ratio = (dimensions.height / dimensions.width * 100).toFixed(3);
                    const figure = document.createElement('figure');
                    figure.setAttribute('style', `padding-top:${ratio}%`);
                    image.setAttribute('style', `margin-top:-${ratio}%`);
                    figure.appendChild(image.cloneNode(true));
                    image.replaceWith(figure);
                }

            });
        }

        //&& ![`${root}/gh-pages/index-top.html`, `${root}/gh-pages/index-bottom.html`].includes(outputPath)
        if (![`${root}/gh-pages/index-top.html`, `${root}/gh-pages/index-bottom.html`, `${root}/gh-pages/offline.html`].includes(outputPath) && !Fs.existsSync(outputPath.replace('/index.html', ''))) {
            FsExtra.mkdirpSync(outputPath.replace('/index.html', ''))
        }

        if (main) {
            Fs.writeFile(outputPath.replace('.html', '.content.html'), `${main.outerHTML}`, (err) => {
                if (err) {
                    // return console.log(err);
                }
                // console.log("The file was saved!");
            });
        }

        if ([`${root}/gh-pages/index-top.html`, `${root}/gh-pages/index-bottom.html`].includes(outputPath)) {
            return value;
        }

        return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
    }
    return value;
};
