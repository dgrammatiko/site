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
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const replace = require('@rollup/plugin-replace');

// PostCSS
const plugins = [
  postcssImport({ extensions: '.css', path: ['./src_assets/css', './src_assets/css/partials']}),
  postcssEasyImport({ extensions: '.css'}),
  postcssNested,
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

// Rollup
opts = [
  {
    input: `src_site/serviceworker.js`,
    output: {
      file: `src_site/_includes/serviceworker.js`,
      format: 'esm',
    },
    plugins: [
      nodeResolve(),
      replace({ 'process.env.NODE_ENV': '"production"', preventAssignment: true }),
      terser(),
    ],
  },
  {
    input: './node_modules/ce-theme-switcher/src/index.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: `./live/static/js/${'./node_modules/ce-theme-switcher/src/index.js'
        .replace('./node_modules/', '')
        .replace('/src/index.js', '')}.esm.js`,
    },
    plugins: [terser()],
  },
  {
    input: './node_modules/lite-youtube-embed/src/lite-yt-embed.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/lite-youtube-embed.js'
    },
    plugins: [nodeResolve(),terser()],
  },
  {
    input: './src_site/router.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/router.js'
    },
    plugins: [nodeResolve(),terser()],
  },
];

const pack = async (opt) => {
  try {
    const bundle = await rollup.rollup({
        input: opt.input,
        plugins: opt.plugins
      });

    // const { output } = await bundle.generate({
    //     format: 'es',
    //     sourcemap: false,
    //   });

    await bundle.write(opt.output);

    // closes the bundle
    await bundle.close();

    return;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

module.exports = {
  postcss: async () => {
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
  },
  rollup: Promise.all(opts.map(pack)),
}
