/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const fs = require('fs');
const Path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const paths = require('./paths');
const mkdirp = require('mkdirp');

const browserSettings = [
  require('postcss-easy-import')({ extensions: '.pcss' }),
  require('postcss-import')({ extensions: '.pcss' }),
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
  // require('cssnano')({ from: undefined })
];

const compile = async (file, opts) => {
  await postcss(opts).process(
    fs.readFileSync(`${file}`, 'utf8'),
    { from: undefined, removeAll: true })
    .then((result) => {
      fs.writeFileSync(`${file.replace(`${paths.buildSrc}`, `${paths.buildDest}`).replace('/pcss/', '/css/').replace('.pcss', '')}.min.css`, result.css);
    });
}

glob.sync(`./${paths.buildSrc}/_assets/pcss/**/*.pcss`).forEach((file) => {
  if (Path.parse(file).base.match(/^_/)) { return; }
  console.log('Processing:', file)

  const xPath = Path.dirname(file.replace(`${paths.buildSrc}`, `${paths.buildDest}`).replace('/pcss/', '/css/'));
  if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

  compile(file, browserSettings)
});
