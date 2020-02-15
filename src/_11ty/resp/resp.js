'use strict';

const path = require('path');
const wild2regex = require('./wildcardToRegex');

function analyze_options(option) {
  let i;
  let srcset, sizes, keys, reg;
  const temp = {};
  const ret = [];

  srcset = Object.keys(option.srcset);
  for (i = 0; i < srcset.length; i++) {
    reg = wild2regex(srcset[i]);
    temp[srcset[i]] = {};
    temp[srcset[i]].regex = reg;
    temp[srcset[i]].rules = option.srcset[srcset[i]];
  }

  if (option.sizes) {
    sizes = Object.keys(option.sizes);
    for (i = 0; i < sizes.length; i++) {
      // check if the same key is contained in 'srcset'
      if (temp[sizes[i]]) {
        temp[sizes[i]].sizes = option.sizes[sizes[i]];
      }
    }
  }


  keys = Object.keys(temp);
  for (i = 0; i < keys.length; i++) {
    ret.push(temp[keys[i]]);
  }

  return ret;
}

// Return first pattern to match.
// If not, return -1
function matchPattern(src, patterns) {
  let i;
  for (i = 0; i < patterns.length; i++) {
    if (patterns[i].regex.exec(src)) {
      return i;
    }
  }
  return -1;
}

function renderResponsive(md, tokens, idx, options, env, slf, rr_options) {
  let token = tokens[idx];
  let patterns = analyze_options(rr_options.responsive);
  // normal fields
  let filename = token.attrs[token.attrIndex('src')][1];
  if (token.attrIndex('alt') === -1) {
    token.attrPush(['alt', slf.renderInlineAsText(token.children, options, env)]);
  } else if (!token.attrs[token.attrIndex('alt')][1]) {
    token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env);
  }

  // responsive fields
  let i, patternId;
  let base, ext, dir, rules, isFirst;

  if ((patternId = matchPattern(filename, patterns)) >= 0) {
    rules = patterns[patternId].rules;
    ext = path.extname(filename);
    base = path.basename(filename, ext);
    dir = path.dirname(filename);
    // if (ext === 'jpeg' || ext === 'jpg' || ext === 'jpe') ext = 'jpg';
    isFirst = true;
    let srcset = '';
    let tmpfile, tmpdir;
    for (i = 0; i < rules.length; i++) {
      if (!isFirst) { srcset += ', '; }
      tmpfile = '';
      if (rules[i].rename && rules[i].rename.prefix) {
        tmpfile += rules[i].rename.prefix + base;
      }
      tmpfile += base;
      if (rules[i].rename && rules[i].rename.suffix) {
        tmpfile += rules[i].rename.suffix;
      }
      tmpdir = dir;
      if (rules[i].rename && rules[i].rename.path) {
        if (typeof rules[i].rename.path === 'function') {
          tmpdir = rules[i].rename.path(tmpdir);
        } else if (typeof rules[i].rename.path === 'string') {
          tmpdir = rules[i].rename.path;
        }
      }
      if (tmpdir === '.') {
        tmpdir = '';
      } else {
        tmpdir += '/';
      }
      srcset += tmpdir + tmpfile + ext + ' ';
      if (rules[i].width) { srcset += rules[i].width + 'w'; }
      if (rules[i].height) { srcset += rules[i].height + 'h'; }
      isFirst = false;
    }

    if (srcset) {
      if (rr_options.responsive.removeSrc) {
        token.attrs.splice(token.attrIndex('src'), 1);
      }

      token.attrPush(['srcset', srcset]);

      if (patterns[patternId].sizes) {
        token.attrPush(['sizes', patterns[patternId].sizes]);
      }
    }
  }

  return slf.renderToken(tokens, idx, options);
}

function responsive_image(md, options) {
  return function (tokens, idx, opt, env, slf) {
    return renderResponsive(md, tokens, idx, opt, env, slf, options);
  };
}

module.exports = function responsive_plugin(md, options) {
  if (!options || !options.responsive) {
    throw new Error('markdown-it-responsive needs options');
  }
  md.renderer.rules.image = responsive_image(md, options);
};
