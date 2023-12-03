import fs from "fs/promises";
import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import postcssEasyImport from 'postcss-easy-import';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssCustomMedia from 'postcss-custom-media';
import postcssDiscardComments from 'postcss-discard-comments';
import postcssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';

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

export default async () => {
  const files = await getFiles('./src_assets/css/');
  return Promise.all(files.map(file => processCss(file.name, file.path)))
}
