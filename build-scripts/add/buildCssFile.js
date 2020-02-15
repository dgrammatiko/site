/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const postcss = require('postcss');
const paths = require('../paths');

module.exports.addCssFile = async (file) => {
  await postcss([
    // require('postcss-easy-import')({ extensions: '.css' }),
    require('postcss-import'), //({ extensions: '.css' })
    require('postcss-mixins'),
    require('postcss-custom-selectors'),
    require('postcss-nesting'),
    require('postcss-custom-media'),
    require('postcss-discard-comments')({ removeAll: true }),
    require('postcss-preset-env')({
      autoprefixer: {
        grid: true,
        from: undefined,
      },
      features: {
        'nesting-rules': true,
      },
    }),
    require('cssnano')({ from: undefined })
  ])
    .process(fs.readFileSync(`${file}`, 'utf8'), { from: file, removeAll: true })
    .then((result) => { fs.writeFileSync(`${file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.css', '')}.min.css`, result.css); });
}
