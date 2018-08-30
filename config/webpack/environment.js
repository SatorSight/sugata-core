const { environment } = require('@rails/webpacker');

const quillConfig = require('./quill');
environment.config.merge(quillConfig);

const webpack = require('webpack');
// const merge = require('webpack-merge');

environment.plugins.set('Provide', new webpack.ProvidePlugin({
        $: 'jquery',
        JQuery: 'jquery',
        jquery: 'jquery',
        jQuery: "jquery",
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'


    })
);
//

module.exports = environment;