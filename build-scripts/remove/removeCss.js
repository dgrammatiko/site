/**
  * Build script
  *
  * Dimitris Grammatikogiannis
  */
const { exists, unlinkSync } = require('fs');
const { parse } = require('path');
const paths = require('../paths');

async function checkIfExists(file) {
  const vas = await exists(file, err => {
    if (err) {
      console.log(err)
    }
  });

  return vas;
};

module.exports.removeCssFile = async function (file) {
  if (parse(file).base.startsWith('_')) { return false; }

  const xPath = file.replace(`${paths.staticSrc}`, `${paths.staticDest}`).replace('.css', '.min.css');

  console.log(xPath)
  if (checkIfExists(xPath)) {
    await unlinkSync(xPath);
  }
}
