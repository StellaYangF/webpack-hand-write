
const path = require('path');

module.exports = {
    context: process.cwd(),
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[id].[hash].js',
    },
    mode: 'development',
}