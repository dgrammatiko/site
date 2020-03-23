const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const responsiveImg = require('./build-scripts/_11ty/resp/resp');
const htmlmin = require("html-minifier");
const { siteSrc, siteDest } = require('./build-scripts/paths');
const imageTransform = require('./build-scripts/_11ty/imgTransforms.js');
// const postCss = require('./src/_11ty/postcss-process.js');

const root = process.cwd();
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
    if (fs.existsSync(`${process.cwd()}/${siteDest}/${path}`)) {
      cssCached = fs.readFileSync(`${process.cwd()}/${siteDest}/${path}`, { encoding: 'utf8' });
    } else {
      console.log('Crap');
    }
    return cssCached;
  })

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html") && ![`${root}/${siteDest}/index-top.html`, `${root}/${siteDest}/index-bottom.html`].includes(outputPath)) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addCollection("tagList", require("./build-scripts/_11ty/getTagList"));

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

  eleventyConfig.addTransform('parse', imageTransform);

  // eleventyConfig.setBrowserSyncConfig({
  //   callbacks: {
  //     ready: function (err, bs) {
  //       const content_404 = fs.readFileSync(`${buildDest}/404.html`);

  //       bs.addMiddleware("*", (req, res) => {
  //         // Provides the 404 content without redirect.
  //         res.write(content_404);
  //         // Add 404 http status code in request header.
  //         // res.writeHead(404, { "Content-Type": "text/html" });
  //         res.writeHead(404);
  //         res.end();
  //       });
  //     }
  //   }
  // });

  eleventyConfig.addPassthroughCopy('src_site/_headers', 'live/_headers')

  return {
    pathPrefix: "/",
    passthroughFileCopy: true,
    dir: {
      input: siteSrc,
      output: `${process.cwd()}/${siteDest}`,
    },
  };
};
