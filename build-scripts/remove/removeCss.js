/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  */
const fs = require('fs');
const Path = require('path');
const paths = require('../paths');

async function checkIfExists(file) {
  const vas = await fs.exists(file, err => {
    if (err) {
      console.log(err)
    }
  });

  return vas;
};

module.exports.removeCssFile = async function (file) {
  if (Path.parse(file).base.match(/^_/)) { return false; }

  const xPath = file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.css', '.min.css');

  console.log(xPath)
  if (checkIfExists(xPath)) {
    await fs.unlinkSync(xPath);
  }
}
