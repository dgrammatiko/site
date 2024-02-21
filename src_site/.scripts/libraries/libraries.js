/* Markdown Plugins */
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import Nunjucks from 'nunjucks';

const options = {
  html: true,
  breaks: true,
  linkify: true,
};
const opts = {
  // permalink: true,
  permalinkClass: 'direct-link',
  permalinkSymbol: '🔗',
};

export default {
  md: markdownIt(options).use(markdownItAnchor, opts),
  njk: new Nunjucks.Environment(new Nunjucks.FileSystemLoader('./src_site/_includes')),
};
