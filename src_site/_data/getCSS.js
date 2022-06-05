const fs = require("fs/promises");
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

const output = {};

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

const getFiles = async (path = "./") => {
  const entries = await fs.readdir(path, { withFileTypes: true });

  // Get files within the current directory and add a path key to the file objects
  return entries
    .filter(file => !file.isDirectory())
    .map(file => ({ ...file, path: path + file.name }));
}

const processCss = async (fileName, filePath) => {
  if (fileName.startsWith('_')) {
    return;
  }

  const fileContent = await fs.readFile(filePath)

   const {css} = await postcss(plugins).process(fileContent, {from: undefined})
  output[filePath.replace('./', '')] = css;

  return output;
}

module.exports = async () => {
  const files = await getFiles('./src_assets/css/');
  return Promise.all(files.map(file => processCss(file.name, file.path)))
}
