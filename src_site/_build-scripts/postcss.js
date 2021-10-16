const { readFile, mkdir, writeFile } = require('fs/promises');
const postcss = require('postcss');
const postcssNested = require('postcss-nested');
const postcssEasyImport = require('postcss-easy-import')
const postcssImport = require('postcss-import');
const postcssMixins = require('postcss-mixins');
const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssCustomMedia = require('postcss-custom-media');
const postcssDiscardComments= require('postcss-discard-comments');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

const plugins = [
  postcssNested,
  postcssEasyImport({ extensions: '.css'}),
  postcssImport({ extensions: '.css', path: ["src_assets/css", "src_assets/css/partials"]}),
  postcssMixins,
  postcssCustomSelectors,
  postcssCustomMedia,
  postcssDiscardComments({ removeAll: true }),
  postcssPresetEnv({
    autoprefixer: {
      from: undefined,
    },
    features: {
      'nesting-rules': true,
    },
  }),
  cssNano({
    from: undefined,
    preset: ['default', { normalizeUrl: false }],
  }),
];

module.exports = async () => {
  try {
    const result = await postcss(plugins).process((await readFile(`${process.cwd()}/src_assets/css/main.css`, {encoding: 'utf8'})), { from: undefined, to: undefined });

    if (result) {
      if (!(await mkdir(`${process.cwd()}/live/static/css`, {recursive: true}))) {
        await writeFile(`${process.cwd()}/live/static/css/main.css`, result.css);
      } else {
        await writeFile(`${process.cwd()}/live/static/css/main.css`, result.css);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};
