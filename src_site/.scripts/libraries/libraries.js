/* Markdown Plugins */
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const Nunjucks = require('nunjucks');

const options = {
  html: true,
  breaks: true,
  linkify: true,
};
const opts = {
  // permalink: true,
  permalinkClass: "direct-link",
  permalinkSymbol: "🔗",
};

module.exports = {
  md: markdownIt(options).use(markdownItAnchor, opts),
  njk: new Nunjucks.Environment(new Nunjucks.FileSystemLoader('./src_site/_includes')),
};
