const filters = require("./src_site/.scripts/filter/filters.js");
const { ogimage, imageShortcode } = require("./src_site/.scripts/shortcodes/ogimage.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.on('beforeBuild', async () => {
    await require("./src_site/.scripts/transorms/rollup.js")();
    await require("./src_site/.scripts/transorms/postcss.js")();
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setLibrary('njk', require('./src_site/.scripts/njk.js'));
  eleventyConfig.setLibrary("md", require("./src_site/.scripts/md.js"));

  eleventyConfig.addPassthroughCopy({ "src_assets/images": "static/images" });
  eleventyConfig.addPassthroughCopy({ "src_assets/fonts": "static/fonts" });
  eleventyConfig.addPassthroughCopy({ "src_site/talks/london-jug-december-2021": "talks/london-jug-december-2021" });

  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"), { alwaysWrapLineHighlights: false });

  eleventyConfig.addCollection("blogs", (collection) => collection.getFilteredByGlob(['src_site/blog/*.md']));
  eleventyConfig.addCollection("code", (collection) =>  collection.getFilteredByGlob(['src_site/code/*.md']));
  eleventyConfig.addCollection("tagList", require("./src_site/.scripts/filter/getTagList"));

  Object.keys(filters).forEach(filterName => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  });

  eleventyConfig.addTransform("htmlmin", require("./src_site/.scripts/transorms/htmlmin.js"));
  eleventyConfig.addTransform("parse", require("./src_site/.scripts/transorms/alltransforms.js"));

  eleventyConfig.addNunjucksAsyncShortcode("imagine", imageShortcode);
  eleventyConfig.addLiquidShortcode("imagine", imageShortcode);
  eleventyConfig.addJavaScriptFunction("imagine", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("ogimg", ogimage);
  eleventyConfig.addPairedShortcode("codepen", require("11ty-to-codepen"));

  return {
    pathPrefix: "/",
    passthroughFileCopy: true,
    dir: {
      data: `_data`,
      input: 'src_site',
      includes: `_includes`,
      layouts: `_includes`,
      output: `${process.cwd()}/live`,
    },
  };
};
