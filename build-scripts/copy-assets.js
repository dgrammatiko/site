const paths = require('./paths.js');
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const { mkdirsSync, copyFileSync } = require('fs-extra');
const commonjs = require('@rollup/plugin-commonjs');
const { dirname } = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');

const commonPlugins = [
    terser(),
];

const plugins = {
    esm: [],
    iife: [
        resolve(),
        commonjs(),
        babel({
            externalHelpers: false,
            sourceMap: false,
            exclude: [/\/core-js\//],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false,
                        targets: {
                            browsers: ['ie 11'],
                        },
                    },
                ],
            ],
        }),
    ]
};

const settings = ['esm', 'iife'];

const execRollup = async function (file, setting) {
    const output = `${paths.staticDest}/js/toggler${setting === 'esm' ? '.esm.js' : '.es5.js'}`;
    const ppp = {
        input: file,
        output: {
            sourcemap: false,
            format: setting,
            file: output
        }
    };

    ppp.plugins = plugins[`${setting}`].concat(commonPlugins);

    mkdirsSync(dirname(output));

    const bundle = await rollup(ppp);
    await bundle.write(ppp.output);

    // eslint-disable-next-line no-console
    console.log(`Generated: ${ppp.output.file}`);
    // eslint-disable-next-line no-console
    console.log('#############################');
};

settings.forEach((setting) => { execRollup('./node_modules/ce-theme-switcher/src/index.js', setting); });

copyFileSync('./node_modules/ce-theme-switcher/src/index.css', `${paths.staticSrc}/css/toggler.css`)

// mkdirsSync(`${paths.staticDest}/js`);
// FsExtra.copyFileSync(`${paths.staticSrc}/js/toggler.esm.js`, `${paths.staticDest}/js/toggler.esm.js`)
// FsExtra.copyFileSync(`${paths.staticSrc}/js/toggler.es5.js`, `${paths.staticDest}/js/toggler.es5.js`)
