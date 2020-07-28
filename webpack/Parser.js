const babylon = require('babylon');
const { Tapable } = require('tapable');

class Parser extends Tapable {
    /**
     * @param {string} source  可以把自负床源码转换成 ast 语法树
     */
    parse(source) {
        const astTree = babylon.parse(source, {
            sourceType: 'module', // 源代码类型是模块
            plugins: ['dynamicImport'], // 支持 import(url)
        });
        return astTree;
    }
};

module.exports = Parser;