const babel = require('@babel/core');

function loader(source, inputSourceMap) {
    console.dir(this.request);
    const options = {
        presets: ['@babel/preset-env'],
        inputSourceMap,
        sourceMaps: true,
        filename: this.request.split('!').pop().split('/').pop(),
    };
    const { code, map, ast } =  babel.transform(source, options);
    return code;
}

module.exports = loader;