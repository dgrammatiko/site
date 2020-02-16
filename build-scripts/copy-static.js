/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const { copy } = require('fs-extra');
const paths = require('./paths');

copy(`${paths.staticSrc}/static`, `${paths.staticDest}`);
