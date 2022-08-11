const filters = require('./src_site/.scripts/filters/filters.js');
const collections = require('./src_site/.scripts/collections/collections.js');
const transforms = require('./src_site/.scripts/transforms/transforms.js');
const shortcodes = require('./src_site/.scripts/shortcodes/shortcodes.js');
const libraries = require('./src_site/.scripts/libraries/libraries.js');
const beforeBuild = require('./src_site/.scripts/beforeBuild/beforeBuild.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-rss'));
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'), { alwaysWrapLineHighlights: false });

  eleventyConfig.addWatchTarget('./src_assets/css');
  eleventyConfig.addPassthroughCopy({ 'src_assets/images': 'static/images' });
  eleventyConfig.addPassthroughCopy({ 'src_assets/fonts': 'static/fonts' });
  eleventyConfig.addPassthroughCopy({ 'src_site/talks/london-jug-december-2021': 'talks/london-jug-december-2021' });

  Object.keys(libraries).forEach(libraryName => eleventyConfig.setLibrary(libraryName, libraries[libraryName]));
  Object.keys(collections).forEach(collectionName => eleventyConfig.addCollection(collectionName, collections[collectionName]));
  Object.keys(filters).forEach(filterName => eleventyConfig.addFilter(filterName, filters[filterName]));
  Object.keys(transforms).forEach(transformName => eleventyConfig.addTransform(transformName, transforms[transformName]));
  Object.keys(shortcodes).forEach(shortcodeName => {
    eleventyConfig.addNunjucksAsyncShortcode(shortcodeName, shortcodes[shortcodeName]);
    eleventyConfig.addLiquidShortcode(shortcodeName, shortcodes[shortcodeName]);
    eleventyConfig.addJavaScriptFunction(shortcodeName, shortcodes[shortcodeName]);
  });

  eleventyConfig.addPairedShortcode('codepen', require('11ty-to-codepen'));

  eleventyConfig.on('beforeBuild', async () => await Promise.all(Object.values(beforeBuild)));

  return {
    passthroughFileCopy: true,
    dir: {
      input: 'src_site',
      layouts: `_includes`,
      output: `${process.cwd()}/live`,
    },
  };
};
