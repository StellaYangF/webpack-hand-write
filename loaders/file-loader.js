const { getOptions, interpolateName } = require('loader-utils');

function loader(source, inputSourceMap, ast) {
    const options = getOptions(this) || {};
    const url = interpolateName(this, options.filename || '[hash].[ext]', {
        content: source,
    });
    this.emitFile(url, source);
    return `module.exports = ${JSON.stringify(url)}`;
}

// 以 二进制格式 读取源文件
loader.raw = true;

module.exports = loader;