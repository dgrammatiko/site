const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const root = process.cwd();
const fsExtra = require('fs-extra');

const d = [];
const files = fs.readdirSync(`${root}/src/_includes/_assets/css`, { withFileTypes: true });

files.forEach(file => {
    if (file.name.startsWith('_')) { return; }
    d.push({
        permalink: `_assets/css/${file.name}`,
        rawFilepath: `${root}/src/_includes/_assets/css/${file.name}`,
        rawCss: fs.readFileSync(`${root}/src/_includes/_assets/css/${file.name}`)
    })
});

module.exports = class {
    async data() {
        d.forEach(a => {
            return postcss([
                require('postcss-import'),
                require('postcss-mixins'),
                require('cssnano')
            ])
                .process(a.rawCss, { from: a.rawFilepath })
                .then(result => {
                    fsExtra.mkdirpSync(path.dirname(`${root}/gh-pages/${a.permalink}`))
                    fs.writeFileSync(`${root}/gh-pages/${a.permalink}`, result.css, (err) => {
                        //console.log(err)
                    });
                    result.css
                });
        });

        return {
            postCss: d
        }
    };

    async render({ postCss }) {
        // postCss.forEach(a => {
        //     return postcss([
        //         require('postcss-import'),
        //         require('postcss-mixins'),
        //         require('cssnano')
        //     ])
        //         .process(a.rawCss, { from: a.rawFilepath })
        //         .then(result => {
        //             fsExtra.mkdirpSync(path.dirname(`${root}/gh-pages/${a.permalink}`))
        //             fs.writeFileSync(`${root}/gh-pages/${a.permalink}`, result.css, (err) => { console.log(err) });
        //             result.css
        //         });
        // });
    };
}
