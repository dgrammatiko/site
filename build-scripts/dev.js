const watch = require('watch');
const paths = require('./paths.js');
const Path = require('path');
const Fs = require('fs');
const { removeCssFile } = require('./remove/removeCss.js');
const { addCssFile } = require('./add/buildCssFile.js');
const { buildImages } = require('./add/responsive-images.js');
const { removeImages } = require('./remove/responsive-images.js');

watch.watchTree(`./${paths.buildSrc}/_assets`, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
  } else if (prev === null) {
    // f is a new file
    // pcss
    if (Path.parse(f).base.match(/\.pcss$/)) {
      addCssFile(f);
    }

    // jpg,png
    if (Path.parse(f).base.match(/\.jpg$/) || Path.parse(f).base.match(/\.jpeg$/) || Path.parse(f).base.match(/\.png$/)) {
      buildImages(f);
    }
  } else if (curr.nlink === 0) {
    // f was removed

    // pcss
    if (Path.parse(f).base.match(/\.pcss$/)) {
      removeCssFile(f);
    }

    // jpg,png
    if (Path.parse(f).base.match(/\.jpg$/) || Path.parse(f).base.match(/\.jpeg$/) || Path.parse(f).base.match(/\.png$/)) {
      removeImages(f);
    }
  } else {
    // f was changed

    // pcss
    if (Path.parse(f).base.match(/\.pcss$/)) {
      removeImages(f);
      buildImages(f);
    }
  }
})

  // Switch for supported files
  // js
  // woff, woff2
