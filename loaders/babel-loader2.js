function loader(source, inputSourceMap, ast) {
    // console.log(source, '---source');
    // console.log(inputSourceMap, '---inputSourceMap');
    // console.log(ast, '---ast');
    return source;
}

loader.pitch = function(remainingRequest, previousRequest, data) {
    // console.log(remainingRequest, 'loader2 remainingRequest');
    // // E:\0-前端\00-框架\webpack\hand\loaders\babel-loader.js!E:\0-前端\00-框架\webpack\hand\src\index.js
    // console.log(previousRequest, 'loader2 previousRequest');
    // console.log(data, 'loader2 data');
    data.name = 'pitch1';
    console.log(data, 'loader2: data');
}

module.exports = loader;