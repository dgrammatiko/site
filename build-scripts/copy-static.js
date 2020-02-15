/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const fsExtra = require('fs-extra');
const paths = require('./paths');

fsExtra.copy(`${paths.staticSrc}/tmpl_starchaser`, `${paths.staticDest}/tmpl_starchaser`);
