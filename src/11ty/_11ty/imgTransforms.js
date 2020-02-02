const jsDom = require('@tbranyen/jsdom');
const { JSDOM } = jsDom;
const sizeOf = require('image-size');
const Fs = require('fs');

module.exports = function (value, outputPath) {
    if (outputPath.endsWith('.html')) {
        const DOM = new JSDOM(value, {
            resources: 'usable'
        });

        const document = DOM.window.document;
        const articleImages = [...document.querySelectorAll('img')];

        if (articleImages.length) {
            articleImages.forEach(image => {
                if (!image.getAttribute('data-src')) return;
                const path = `${process.cwd()}/src${image.getAttribute('data-src').replace('@480', '').replace('@320', '')}`;
                if (Fs.existsSync(path)) {
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

        return `<!DOCTYPE html>${document.documentElement.outerHTML}`;
    }
    return value;
};
