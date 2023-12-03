import rss from '@11ty/eleventy-plugin-rss';
import codepen from './src_site/.scripts/plugins/11ty-to-codepen.js';
import highlight from '@11ty/eleventy-plugin-syntaxhighlight';
import filters from './src_site/.scripts/filters/filters.js';
import collections from './src_site/.scripts/collections/collections.js';
import transforms from './src_site/.scripts/transforms/transforms.js';
import shortcodes from './src_site/.scripts/shortcodes/shortcodes.js';
import libraries from './src_site/.scripts/libraries/libraries.js';
import beforeBuild from './src_site/.scripts/beforeBuild/beforeBuild.js';
import { directories } from './src_site/.scripts/passthorughCopy/passthroughCopy.js';

const shortcodeFns = ['addNunjucksAsyncShortcode', 'addLiquidShortcode', 'addJavaScriptFunction'];

export default function(conf) {
  conf.addWatchTarget('./src_assets/css');
  directories.forEach(obj => conf.addPassthroughCopy(obj));

  Object.keys(libraries).forEach(name => conf.setLibrary(name, libraries[name]));
  Object.keys(collections).forEach(name => conf.addCollection(name, collections[name]));
  Object.keys(filters).forEach(name => conf.addFilter(name, filters[name]));
  Object.keys(transforms).forEach(name => conf.addTransform(name, transforms[name]));
  Object.keys(shortcodes).forEach(name => shortcodeFns.map(fn => conf[fn](name, shortcodes[name])));

  conf.addPlugin(codepen);
  conf.addPlugin(rss);
  conf.addPlugin(highlight);

  conf.on('befor eBuild', async () => await Promise.all(Object.values(beforeBuild)));

  return {
    dir: {
      input: 'src_site',
      output: `${process.cwd()}/live`,
    },
  };
};
