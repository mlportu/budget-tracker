const path = require('path');
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
    entry: {
        index: './public/js/index.js',
    },    
    output: { 
        filename: '[name].bundle.js',
        path: __dirname + "/dist",
    },
    devServer:{
        contentBase:'./public',
        hot: true
    },
    plugins: [
        new WebpackPwaManifest({
            name: "Budget Tracker",
            short_name: "Budgets",
            // icons: [{
            //     src: path.resolve('public/icons/icon-512x512.png'),
            //     sizes: [72,96,128,144,152,192,384,512],
            //     destination: path.join('public', 'icons')
            // }],
            theme_color: "#6b4afd",
            background_color: "#dddddd",
            start_url: "../index.html",
            display: "standalone"
        })
    ],
    mode: 'development'
}