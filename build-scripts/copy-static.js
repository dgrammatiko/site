/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const { copy } = require('fs-extra');
const paths = require('./paths');

copy(`${paths.staticSrc}/tmpl_starchaser`, `${paths.staticDest}/tmpl_starchaser`);
