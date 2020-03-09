import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { siteSrc } from './build-scripts/paths.esm'
module.exports = {
    input: `${siteSrc}/serviceworker.js`,
    output: {
        file: `${siteSrc}/_includes/serviceworker.js`,
        format: 'esm',
    },
    plugins: [
        resolve(),
        replace({ 'process.env.NODE_ENV': '"production"' }),
        terser(),
    ]
};
