/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  *
  * License MIT
  */
const rmrf = require('rmrf');
const fs = require('fs');
const paths = require('./paths');

if (fs.existsSync(`${paths.staticDest}`)) {
  rmrf(`${paths.staticDest}`)
}
