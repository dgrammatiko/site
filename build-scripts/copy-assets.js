const paths = require('./paths.js');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const FsExtra = require('fs-extra');
const commonjs = require('@rollup/plugin-commonjs');
const path = require('path');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('rollup-plugin-terser');

const commonPlugins = [
    terser.terser(),
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
    const output = `${paths.buildDest}/_assets/js/toggler${setting === 'esm' ? '.esm.js' : '.es5.js'}`;
    const ppp = {
        input: file,
        output: {
            sourcemap: false,
            format: setting,
            file: output
        }
    };

    ppp.plugins = plugins[`${setting}`].concat(commonPlugins);

    FsExtra.mkdirsSync(path.dirname(output));

    const bundle = await rollup.rollup(ppp);
    await bundle.write(ppp.output);

    // eslint-disable-next-line no-console
    console.log(`Generated: ${ppp.output.file}`);
    // eslint-disable-next-line no-console
    console.log('#############################');
};

settings.forEach((setting) => { execRollup('./node_modules/ce-theme-switcher/src/index.js', setting); });

// FsExtra.copyFileSync('./node_modules/ce-theme-switcher/src/index.css', `${paths.buildSrc}/_assets/pcss/toggler.pcss`)

// FsExtra.mkdirp(`${paths.buildDest}/_assets/js`);
// FsExtra.copyFileSync(`${paths.buildSrc}/_assets/js/toggler.esm.js`, `${paths.buildDest}/_assets/js/toggler.esm.js`)
// FsExtra.copyFileSync(`${paths.buildSrc}/_assets/js/toggler.es5.js`, `${paths.buildDest}/_assets/js/toggler.es5.js`)
