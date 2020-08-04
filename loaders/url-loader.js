const { getOptions, interpolateName } = require('loader-utils');
const mime = require('mime');
const path = require('path');
const resolve = (...args) => path.resolve(__dirname, ...args);

function loader(source) {
    let { limit, fallback = 'file-loader' } = getOptions(this) || {}
    if (limit) limit = parseInt(limit, 10);// 十进制转任意进制（默认十进制）
    const mimeType = mime.getType(this.resourcePath);
    if (!limit || source.length < limit) {
        const base64 = `data:${mimeType};base64,${source.toString('base64')}`;
        return `module.exports = ${JSON.stringify(base64)}`;
    } else {
        console.log(fallback);
        let fileLoader = require(resolve(fallback));
        return fileLoader.call(this, source);
    }
}

loader.raw = true;

module.exports = loader;