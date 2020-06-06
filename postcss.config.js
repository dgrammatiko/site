module.exports = {
    plugins: [
        require('postcss-nested'),
        require('postcss-easy-import')({ extensions: '.css' }),
        require('postcss-import')({ extensions: '.css' }),
        require('postcss-mixins'),
        require('postcss-custom-selectors'),
        require('postcss-custom-media'),
        require('postcss-discard-comments')({ removeAll: true }),
        require('postcss-preset-env')({
            autoprefixer: {
                from: undefined,
            },
            features: {
                'nesting-rules': true,
            },
        }),
        require('cssnano')({
            from: undefined,
            preset: ['default', { normalizeUrl: false }],
        }),
    ],
};
