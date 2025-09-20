import { mkdir, writeFile } from 'node:fs/promises';
import { transform, bundle, Features } from 'lightningcss';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

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
    input: 'src_assets/js/ee.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/ee.js',
    },
    plugins: [terser()],
  },
  {
    input: 'src_assets/js/lite-yt-embed.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/lite-youtube-embed.js',
    },
    plugins: [nodeResolve(), terser()],
  },
  // {
  //   input: 'src_assets/js/router.js',
  //   output: {
  //     sourcemap: false,
  //     format: 'esm',
  //     file: './live/static/js/router.js',
  //   },
  //   plugins: [nodeResolve(), terser()],
  // },
  {
    input: 'src_assets/js/balloons.js',
    output: {
      sourcemap: false,
      format: 'esm',
      file: './live/static/js/balloons.js',
    },
    plugins: [nodeResolve(), terser()],
  },
  {
    input: 'src_assets/js/tpl.js',
    output: {
      sourcemap: false,
      format: 'iife',
      dir: './live/static/js',
    },
    plugins: [terser()],
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
    const { code, map } = bundle({
      filename: 'src_assets/css/main.css',
      minify: true,
      include: Features.Colors | Features.Nesting,
    });

    if (code) {
      if (!(await mkdir(`${process.cwd()}/live/static/css`, { recursive: true }))) {
        await writeFile(`${process.cwd()}/live/static/css/main.css`, code);
      } else {
        await writeFile(`${process.cwd()}/live/static/css/main.css`, code);
      }
    }
  } catch (error) {
    console.error(error)
    throw new Error('Check the CSS');
  }
}
export default async () => Promise.all([postcssFn(), ...opts.map(pack)]);
