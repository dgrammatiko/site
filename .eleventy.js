const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const responsiveImg = require('./src/11ty/_11ty/resp/resp');
const htmlmin = require("html-minifier");
const { buildSrc, buildDest } = require('./build-scripts/paths');

const imgOptions = {
  responsive: {
    'srcset': {
      '*': [{
        width: 320,
        rename: { suffix: '@320' },
      }, {
        width: 480,
        rename: { suffix: '@480' },
      }, {
        width: 768,
        rename: { suffix: '@768' },
      }, {
        width: 992,
        rename: { suffix: '@992' },
      }, {
        width: 1200,
        rename: { suffix: '@1200' },
      }, {
        width: 1600,
        rename: { suffix: '@1600' },
      }, {
        width: 1920,
        rename: { suffix: '@1920' },
      }]
    },
    sizes: {}
  },
  quality: 80,
  progressive: true,
  withMetadata: false,
  withoutEnlargement: true,
  errorOnUnusedImage: false,
  errorOnEnlargement: false
};

module.exports = function (eleventyConfig) {
  // eleventyConfig.setTemplateFormats("html,njk");
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);

  // eleventyConfig.addLayoutAlias("post", "layouts/blog.njk");

  // Filter source file names using a glob
  eleventyConfig.addCollection("blogs", function (collection) {
    // Also accepts an array of globs!
    return collection.getFilteredByGlob(["src/11ty/blog/*.md"]);
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("imgSuffix", (imgStr, suffix) => {
    const i = imgStr.lastIndexOf('.');
    const imgPath = imgStr.substring(0, i);
    let ext = imgStr.substring(i + 1);
    ext = ext === 'jpeg' ? 'jpg' : ext;
    return `${imgPath}@${suffix}.${ext}`;
  })

  eleventyConfig.addFilter("inlineCss", (path) => {
    let cssCached;
    console.log(path)
    if (fs.existsSync(path)) {
      cssCached = fs.readFileSync(path, { encoding: 'utf8' });
    } else {
      console.log('Crap');
    }
    return cssCached;
  })

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addCollection("tagList", require("./src/11ty/_11ty/getTagList"));

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
    .use(responsiveImg, imgOptions)
  );

  // eleventyConfig.setFrontMatterParsingOptions({
  //   excerpt: true,
  //   // Eleventy custom option
  //   // The variable where the excerpt will be stored.
  //   excerpt_alias: 'custom_excerpt'
  // });

  return {
    // templateFormats: ["njk", "html", "md"],
    pathPrefix: "/",
    // markdownTemplateEngine: "njk",
    // htmlTemplateEngine: "njk",
    // dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: `${buildSrc}/11ty`,
      output: buildDest,
      data: "_data",
      includes: "_includes"
    },
  };
};
