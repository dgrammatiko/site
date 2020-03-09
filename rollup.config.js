import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/service-worker.js',
  output: {
    file: 'src/layouts/service-worker.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    replace({ 'process.env.NODE_ENV': '"production"' }),
    terser(),
  ]
};
