/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const rmrf = require('rmrf');
const { existsSync } = require('fs');
const paths = require('./paths');

if (existsSync(`${paths.staticDest}`)) {
  rmrf(`${paths.staticDest}`)
}
