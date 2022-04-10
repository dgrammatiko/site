const { promises: fs } = require("fs");
const Fs = require("fs");
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
  const files = entries
    .filter(file => !file.isDirectory())
    .map(file => ({ ...file, path: path + file.name }));

  // Get folders within the current directory
  const folders = entries.filter(folder => folder.isDirectory());

  // for (const folder of folders)
  //   /*
  //     Add the found files within the subdirectory to the files array by calling the
  //     current function itself
  //   */
  //   files.push(...await getFiles(`${path}${folder.name}/`));

  return files;
}

const processCss = async (fileName, filePath) => {
  if (fileName.startsWith('_')) {
    return;
  }

  // if (!Fs.existsSync(filePath.replace('src_assets', 'src_site/_includes/assets/static'))) {
  //   await Fs.mkdirSync(dirname(filePath.replace('src_assets', 'src_site/_includes/assets/static')), { recursive: true});
  // }

  const fileContent = await fs.readFile(filePath)

   const {css} = await postcss(plugins).process(fileContent, {from: undefined})
  output[filePath.replace('./', '')] = css;

  return output;
}

module.exports = async () => {
  const files = await getFiles('./src_assets/css/');
  return Promise.all(files.map(file => processCss(file.name, file.path)))
}
