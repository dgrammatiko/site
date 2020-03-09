/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const fsExtra = require('fs-extra');
const paths = require('./paths');

fsExtra.copy(`${paths.buildSrc}/_assets/tmpl_starchaser`, `${paths.buildDest}/_assets/tmpl_starchaser`);
fsExtra.copy(`${paths.buildSrc}/_assets/js`, `${paths.buildDest}/_assets/js`);
