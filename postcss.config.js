const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-import'),
    require('postcss-modules')({
      getJSON: function(cssFileName, json, outputFileName) {
        const parsedPath = path.parse(outputFileName);
        mkdirp.sync(parsedPath.dir);
        fs.writeFileSync(outputFileName + '.json', JSON.stringify(json));
      },
    }),
    require('cssnano')({
      // Avoid normalizeUrl, else it breaks confboxAsset()
      preset: ['default', { normalizeUrl: false }],
    }),
  ],
};
