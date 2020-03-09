const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = {
    plugins: [
        require('postcss-nested'),
        // require('postcss-import'),
        // require('postcss-modules')({
        //   getJSON: function(cssFileName, json, outputFileName) {
        //     const parsedPath = path.parse(outputFileName);
        //     mkdirp.sync(parsedPath.dir);
        //     fs.writeFileSync(outputFileName + '.json', JSON.stringify(json));
        //   },
        // }),
        // require('cssnano')({
        //   // Avoid normalizeUrl, else it breaks confboxAsset()
        //   preset: ['default', { normalizeUrl: false }],
        // }),

        require('postcss-easy-import')({ extensions: '.css' }),
        require('postcss-import')({ extensions: '.css' }),
        require('postcss-mixins'),
        require('postcss-custom-selectors'),
        // require('postcss-nesting'),
        require('postcss-custom-media'),
        require('postcss-discard-comments')({ removeAll: true }),
        require('postcss-preset-env')({
            autoprefixer: {
                grid: true,
                from: undefined,
            },
            features: {
                'nesting-rules': true,
            },
        }),
        // require('cssnano')({ from: undefined }),
        require('cssnano')({
            from: undefined,
            preset: ['default', { normalizeUrl: false }],
        }),
    ],
};
