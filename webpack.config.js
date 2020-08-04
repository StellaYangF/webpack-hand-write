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
                    'babel-loader2',
                    'babel-loader',
                ]
            }, {
                test: /\.jpg$/,
                use: [
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         filename: '[contentHash].[ext]',
                    //     }
                    // },
                    {
                        loader: 'url-loader',
                        options: {
                            filename: 'images/[hash].[ext]',
                            // limit: 1024 * 20,
                        }
                    }
                ]
            }
        ],
    },
    resolveLoader: {
        alias: {
            // 'babel-loader': resolve('loaders/babel-loader.js'),
        },
        modules: [ resolve('loaders'), 'node_modules' ],
    },
}