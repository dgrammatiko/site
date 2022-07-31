/* Markdown Plugins */
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
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

module.exports = markdownIt(options).use(markdownItAnchor, opts);
