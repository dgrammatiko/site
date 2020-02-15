const chokidar = require('chokidar');
const { staticSrc, staticDest } = require('./paths.js');
const Path = require('path');
const glob = require('glob');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { removeCssFile } = require('./remove/removeCss.js');
const { addCssFile } = require('./add/buildCssFile.js');
const { buildImages } = require('./add/responsive-images.js');
const { removeImages } = require('./remove/responsive-images.js');


// Initialize watcher.
const watcher = chokidar.watch(`${staticSrc}/**/*`, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => {
    const file = Path.parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      if (file.base.startsWith('_')) {
        glob.sync(`./${staticSrc}/css/**/*.css`).forEach((f) => {
          if (Path.parse(f).base.match(/^_/)) { return; }
          console.log('Processing:', f)

          const xPath = Path.dirname(f.replace(`${staticSrc}`, `${staticDest}`));
          if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

          addCssFile(f);
        });
      } else {
        addCssFile(path);
      }
    }

    // jpg,png
    if (file.base.match(/\.jpg$/) || file.base.match(/\.jpeg$/) || file.base.match(/\.png$/)) {
      buildImages(path);
    }
    log(`File ${path} has been added`)
  })
  .on('change', path => {
    const file = Path.parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      if (file.base.startsWith('_')) {
        glob.sync(`./${staticSrc}/css/**/*.css`).forEach((f) => {
          if (Path.parse(f).base.match(/^_/)) { return; }
          console.log('Processing:', f)

          const xPath = Path.dirname(f.replace(`${staticSrc}`, `${staticDest}`));
          if (!fs.existsSync(xPath)) mkdirp.sync(xPath);

          addCssFile(f);
        });
      } else {
        addCssFile(path);
      }
    }

    log(`File ${path} has been changed`);
  })
  .on('unlink', path => {
    const file = Path.parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      removeCssFile(path);
    }

    // jpg,png
    if (file.base.match(/\.jpg$/) || file.base.match(/\.jpeg$/) || file.base.match(/\.png$/)) {
      removeImages(path);
    }
    log(`File ${path} has been removed`);
  });

// More possible events.
// watcher
//   .on('addDir', path => log(`Directory ${path} has been added`))
//   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
//   .on('error', error => log(`Watcher error: ${error}`))
//   .on('ready', () => log('Initial scan complete. Ready for changes'))
//   .on('raw', (event, path, details) => { // internal
//     log('Raw event info:', event, path, details);
//   });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed`); //size to ${stats.size}
});
