const { DateTime } = require("luxon");
let Nunjucks = require('nunjucks');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const { siteSrc, siteDest } = require("./src_site/_build-scripts/paths");
const imageTransform = require("./src_site/_build-scripts/alltransforms.js");
const codepenIt = require("11ty-to-codepen");
const x = require("./src_site/_build-scripts/rollup.js");
const y = require("./src_site/_build-scripts/postcss.js");
const { ogimage, imageShortcode } = require("./src_site/_build-scripts/ogimage.js");

const root = process.cwd();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src_assets/images": "static/images" });
  eleventyConfig.addPassthroughCopy({ "src_assets/fonts": "static/fonts" });
  eleventyConfig.addPassthroughCopy({ "src_site/talks/london-jug-december-2021": "talks/london-jug-december-2021" });

  eleventyConfig.on('beforeBuild', async () => {
    await x();
    await y();
  });

  let nunjucksEnvironment = new Nunjucks.Environment(new Nunjucks.FileSystemLoader('./src_site/_includes'));
  // nunjucksRender.nunjucks.configure(['./templates/']);
  eleventyConfig.setLibrary('njk', nunjucksEnvironment)

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight, { alwaysWrapLineHighlights: false });
  eleventyConfig.setDataDeepMerge(true);

  // Filter source file names using a glob
  eleventyConfig.addCollection("blogs", (collection) => collection.getFilteredByGlob([`${siteSrc}/blog/*.md`]));
  // Filter source file names using a glob
  eleventyConfig.addCollection("code", (collection) =>  collection.getFilteredByGlob([`${siteSrc}/code/*.md`]));
  eleventyConfig.addFilter("readableDate", (dateObj) => DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy"));
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd"));

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => (n < 0) ? array.slice(n) : array.slice(0, n));

  eleventyConfig.addFilter("getWebmentionsForUrl", (webmentions, url) => webmentions.children.filter(entry => entry['wm-target'] === url));
  eleventyConfig.addFilter("size", (mentions) => !mentions ? 0 : mentions.length);
  eleventyConfig.addFilter("webmentionsByType", (mentions, mentionType) => mentions.filter(entry => !!entry[mentionType]));

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      outputPath.endsWith(".html") &&
      ![
        `${root}/${siteDest}/index-top.html`,
        `${root}/${siteDest}/index-bottom.html`,
      ].includes(outputPath)
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
      // return content
    } else if (
      [
        `${root}/${siteDest}/index-top.html`,
        `${root}/${siteDest}/index-bottom.html`,
      ].includes(outputPath)
    ) {
      return content.replace(/>\s*\n\s*</g, "><");
    }
    return content;
  });

  eleventyConfig.addCollection("tagList", require("./src_site/_build-scripts/getTagList"));

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let opts = {
    // permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "🔗",
  };

  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAnchor, opts));

  eleventyConfig.addNunjucksAsyncShortcode("imagine", imageShortcode);
  eleventyConfig.addLiquidShortcode("imagine", imageShortcode);
  eleventyConfig.addJavaScriptFunction("imagine", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("ogimg", ogimage);

  eleventyConfig.addTransform("parse", imageTransform);
  eleventyConfig.addPairedShortcode("codepen", codepenIt);

  return {
    pathPrefix: "/",
    passthroughFileCopy: true,
    dir: {
      data: `_data`,
      input: siteSrc,
      includes: `_includes`,
      layouts: `_includes`,
      output: `${process.cwd()}/${siteDest}`,
    },
  };
};
