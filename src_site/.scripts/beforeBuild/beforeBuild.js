import { readFile, mkdir, writeFile } from 'node:fs/promises';
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
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

// PostCSS
const plugins = [
  postcssImport({ extensions: '.css', path: ['./src_assets/css', './src_assets/css/partials'] }),
  postcssEasyImport({ extensions: '.css' }),
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
const opts = [
  {
    input: `src_site/serviceworker.js`,
    output: {
      file: `src_site/_includes/serviceworker.js`,
      format: 'esm',
    },
    plugins: [nodeResolve(), replace({ 'process.env.NODE_ENV': '"production"', preventAssignment: true }), terser()],
  },
  {
    input: 'src_assets/js/theme-toggle.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/theme-toggle.js',
    },
    plugins: [terser()],
  },
  {
    input: './node_modules/lite-youtube-embed/src/lite-yt-embed.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/lite-youtube-embed.js',
    },
    plugins: [nodeResolve(), terser()],
  },
  {
    input: './src_site/router.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/router.js',
    },
    plugins: [nodeResolve(), terser()],
  },
];

const pack = async (opt) => {
  try {
    const bundle = await rollup({
      input: opt.input,
      plugins: opt.plugins,
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

async function postcssFn() {
  try {
  const result = await postcss(plugins).process(await readFile(`${process.cwd()}/src_assets/css/main.css`, { encoding: 'utf8' }), {
    from: undefined,
    to: undefined,
  });

  if (result) {
    if (!(await mkdir(`${process.cwd()}/live/static/css`, { recursive: true }))) {
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
}
export default Promise.all([postcssFn(), ...opts.map(pack)]);
