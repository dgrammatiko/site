const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');

opts = [
  {
    input: `src_site/serviceworker.js`,
    output: {
      file: `src_site/_includes/serviceworker.js`,
      format: "esm",
    },
    plugins: [
      nodeResolve(),
      replace({ 'process.env.NODE_ENV': '"production"', preventAssignment: true }),
      terser(),
    ],
  },
  {
    input: "./node_modules/ce-theme-switcher/src/index.js",
    output: {
      sourcemap: false,
      format: "esm",
      file: `./live/static/js/${"./node_modules/ce-theme-switcher/src/index.js"
        .replace("./node_modules/", "")
        .replace("/src/index.js", "")}.esm.js`,
    },
    plugins: [terser()],
  },
  {
    input: "./node_modules/lite-youtube-embed/src/lite-yt-embed.js",
    output: {
      sourcemap: false,
      format: "esm",
      file: "./live/static/js/lite-youtube-embed.js"
    },
    plugins: [terser()],
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

module.exports = async () => {
  await Promise.all(opts.map(pack));
}
