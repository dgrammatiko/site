const filters = require('./src_site/.scripts/filters/filters.js');
const collections = require('./src_site/.scripts/collections/collections.js');
const transforms = require('./src_site/.scripts/transforms/transforms.js');
const shortcodes = require('./src_site/.scripts/shortcodes/shortcodes.js');
const libraries = require('./src_site/.scripts/libraries/libraries.js');
const beforeBuild = require('./src_site/.scripts/beforeBuild/beforeBuild.js');
const { directories } = require('./src_site/.scripts/passthorughCopy/passthroughCopy.js');
const shortcodeFns = ['addNunjucksAsyncShortcode', 'addLiquidShortcode', 'addJavaScriptFunction'];

module.exports = (conf) => {
  conf.addWatchTarget('./src_assets/css');
  directories.forEach(obj => conf.addPassthroughCopy(obj));

  Object.keys(libraries).forEach(name => conf.setLibrary(name, libraries[name]));
  Object.keys(collections).forEach(name => conf.addCollection(name, collections[name]));
  Object.keys(filters).forEach(name => conf.addFilter(name, filters[name]));
  Object.keys(transforms).forEach(name => conf.addTransform(name, transforms[name]));
  Object.keys(shortcodes).forEach(name => shortcodeFns.map(fn => conf[fn](name, shortcodes[name])));

  conf.addPlugin(require('./src_site/.scripts/plugins/11ty-to-codepen.js'));
  conf.addPlugin(require('@11ty/eleventy-plugin-rss'));
  conf.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'));

  conf.on('beforeBuild', async () => await Promise.all(Object.values(beforeBuild)));

  return {
    dir: {
      input: 'src_site',
      output: `${process.cwd()}/live`,
    },
  };
};
