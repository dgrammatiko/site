const { watch } = require('chokidar');
const { staticSrc, staticDest } = require('./paths.js');
const { parse, dirname } = require('path');
const { sync } = require('glob');
const { existsSync } = require('fs');
const { mkdirSync } = require('fs-extra');
const { removeCssFile } = require('./remove/removeCss.js');
const { addCssFile } = require('./add/buildCssFile.js');
const { buildImages } = require('./add/responsive-images.js');
const { removeImages } = require('./remove/responsive-images.js');


// Initialize watcher.
const watcher = watch(`${staticSrc}/**/*`, {
  ignored: /(^|[\/\\])\..|\/images\//, // ignore dotfiles
  persistent: true
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watcher
  .on('add', path => {
    const file = parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      if (file.base.startsWith('_')) {
        sync(`./${staticSrc}/css/**/*.css`).forEach((f) => {
          if (parse(f).base.match(/^_/)) { return; }
          console.log('Processing:', f)

          const xPath = dirname(f.replace(`${staticSrc}`, `${staticDest}`));
          if (!existsSync(xPath)) mkdirSync(xPath);

          addCssFile(f);
        });
      } else {
        addCssFile(path);
      }
    }

    // jpg,png
    if (file.base.match(/\.jpg$/) || file.base.match(/\.jpeg$/) || file.base.match(/\.png$/)) {
      if (file.dir.match(/images\//)) {
        console.log(file.dir)
        return
      }
      buildImages(path);
    }
    log(`File ${path} has been added`)
  })
  .on('change', path => {
    const file = parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      if (file.base.startsWith('_')) {
        sync(`./${staticSrc}/css/**/*.css`).forEach((f) => {
          if (parse(f).base.match(/^_/)) { return; }
          console.log('Processing:', f)

          const xPath = dirname(f.replace(`${staticSrc}`, `${staticDest}`));
          if (!existsSync(xPath)) mkdirSync(xPath);

          addCssFile(f);
        });
      } else {
        addCssFile(path);
      }
    }

    log(`File ${path} has been changed`);
  })
  .on('unlink', path => {
    const file = parse(path);
    // pcss
    if (file.base.match(/\.css$/)) {
      removeCssFile(path);
    }

    // jpg,png
    if (file.base.match(/\.jpg$/) || file.base.match(/\.jpeg$/) || file.base.match(/\.png$/)) {
      if (file.dir.match(/images\//)) {
        console.log(file.dir)
        return
      }
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
