const path = require('path');
const webpack = require('webpack');

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
    mode: 'development'
}