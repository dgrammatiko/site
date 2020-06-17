const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const { siteSrc, siteDest } = require("./src_site/_build-scripts/paths");
const imageTransform = require("./src_site/_build-scripts/alltransforms.js");
const codepenIt = require("11ty-to-codepen");

const root = process.cwd();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);

  // Filter source file names using a glob
  eleventyConfig.addCollection("blogs", function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob([`${siteSrc}/blog/*.md`]);
  });

  // Filter source file names using a glob
  eleventyConfig.addCollection("code", function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob([`${siteSrc}/code/*.md`]);
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

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

  eleventyConfig.addCollection(
    "tagList",
    require("./src_site/_build-scripts/getTagList")
  );

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "🔗",
  };

  eleventyConfig.setLibrary(
    "md",
    markdownIt(options).use(markdownItAnchor, opts)
  );

  eleventyConfig.addTransform("parse", imageTransform);

  eleventyConfig.addPassthroughCopy("src_site/_headers", "live/_headers");
  eleventyConfig.addPassthroughCopy({ "src_assets/images": "static/images" });
  eleventyConfig.addPassthroughCopy({ "src_assets/fonts": "static/fonts" });

  // eleventyConfig.addPassthroughCopy('intermediate/static', 'live/static')

  eleventyConfig.addPairedShortcode("codepen", codepenIt);

  return {
    pathPrefix: "/",
    passthroughFileCopy: true,
    dir: {
      input: siteSrc,
      output: `${process.cwd()}/${siteDest}`,
    },
  };
};
