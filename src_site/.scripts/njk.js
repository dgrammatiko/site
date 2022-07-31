const Nunjucks = require('nunjucks');

const nunjucksEnvironment = new Nunjucks.Environment(new Nunjucks.FileSystemLoader('./src_site/_includes'));
// nunjucksRender.nunjucks.configure(['./templates/']);

module.exports = nunjucksEnvironment;
