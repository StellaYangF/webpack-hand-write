const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const resolve = (...args) => path.resolve(__dirname, ...args);

module.exports = {
    context: process.cwd(),
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[id].js',
    },
    mode: 'development',
    devtool: 'none', // 'eval'(default), 'source-map', 'cheap', 'module', 'inline'
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve('public', 'index.html'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ]
            }
        ],
    },
    resolveLoader: {
        alias: {
            'babel-loader': resolve('loaders/babel-loader.js'),
        }
    },
}