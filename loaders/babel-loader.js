const babel = require('@babel/core');

function loader(source, inputSourceMap) {
    const options = {
        presets: ['@babel/preset-env'],
        inputSourceMap,
        sourceMaps: true,
        filename: this.request.split('!').pop().split('/').pop(),
    };
    const { code, map, ast } =  babel.transform(source, options);
    return this.callback(null, code, map, ast);
    // 返回一个参数时，可直接：
    return code;
}
/**
 * 
 * @param {string} remainingRequest 剩余的 request 路径，原始（a!b!module）
 * @param {string} previousRequest 上一次处理的 loader 路径
 * @param {any} data 
 */
loader.pitch = function(remainingRequest, previousRequest, data) {
    // console.log(remainingRequest, 'loader1 remainingRequest');
    // // E:\0-前端\00-框架\webpack\hand\src\index.js
    // console.log(previousRequest, 'loader1 previousRequest');
    // // E:\0-前端\00-框架\webpack\hand\loaders\babel-loader2.js
    console.log(data, 'loader1 data');
}

module.exports = loader;