import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import {
  siteSrc,
  staticDest,
  intermediate,
} from "./src_site/_build-scripts/paths.esm";

module.exports = [
  {
    input: `${siteSrc}/serviceworker.js`,
    output: {
      file: `${siteSrc}/_includes/serviceworker.js`,
      format: "esm",
    },
    plugins: [
      resolve(),
      // replace({ 'process.env.NODE_ENV': '"production"' }),
      terser(),
    ],
  },
  {
    input: "./node_modules/ce-theme-switcher/src/index.js",
    output: {
      sourcemap: false,
      format: "esm",
      file: `./${staticDest}/js/${"./node_modules/ce-theme-switcher/src/index.js"
        .replace("./node_modules/", "")
        .replace("/src/index.js", "")}.esm.js`,
    },
    plugins: [terser()],
  },
  {
    input: "./node_modules/lite-youtube-embed/src/index.js",
    output: {
      sourcemap: false,
      format: "esm",
      file: `./${staticDest}/js/${"./node_modules/lite-youtube-embed/src/index.js"
        .replace("./node_modules/", "")
        .replace("/src/index.js", "")}.esm.js`,
    },
    plugins: [terser()],
  },
];
