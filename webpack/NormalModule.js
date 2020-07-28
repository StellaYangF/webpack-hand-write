let path = require('path');
const types = require('babel-types');
const generate = require('babel-generator').default; // 生成代码
const traverse = require('babel-traverse').default;// 遍历节点

class NormalModule {
    constructor({ name, context, rawRequest, resource, parser, moduleId }) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource; // 模块完整绝对路径
        this.parser = parser;

        // 编译阶段会赋值
        this._source = null; // 源代码 从硬盘上把代码读出来，
        this._ast = null; // 转成抽象语法树

        this.moduleId = moduleId;
        this.dependencies = []; // 子模块依赖的数组
    }

    build(compilation, callback) {
        this.doBuild(compilation, err => {
            // 源码转抽象语法树
            let _ast = this.parser.parse(this._source);
            // 分析依赖
            traverse(_ast, {
                CallExpression: nodePath => {
                    let node = nodePath.node; // 先拿到节点 let title = require('./title');
                    if (node.callee.name === 'require') {
                        node.callee.name='__webpack_require__';
                        let moduleName = node.arguments[0].value; // require 里面的路径 ./title
                        // 后缀检测：有略过，没有添加
                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js': ''; // 模块分开
                        // 获取依赖模块的绝对路径
                        let depResource = path.posix.join(
                            path.posix.dirname(this.resource), //当前模块所在目录
                            moduleName + extension // 依赖模块的相对路径
                        );
                        console.log(depResource);
                        // 拿到 title.js 的绝对路径后，获取依赖模块的模块ID
                        let depModuleId = `.${path.posix.sep}${path.posix.relative(this.context, depResource)}`;
                        this.dependencies.push({
                            name: this.name,
                            moduleId: depModuleId,
                            resource: depResource,
                            context: this.context,
                            rawRequest: moduleName, // ./title
                        });
                        // 修改此节点参数的名称为 depModuleId 字面量 依赖模块 Id
                        // 都是 相对于根目录，打成一级
                        node.arguments = [types.stringLiteral(depModuleId)];
                    }
                }
            });
            let { code } = generate(_ast);
            this._source = code;
            this._ast = ast; // 编译完成
            callback();
        })
    }

    doBuild(compilation, callback) {
        this.getSource(compilation, (err, data) => {
            this._source = data; // 放置从硬盘上读取的源码
            // 读完赋值后，调
            // 转语法树
            callback();
        });
    }

    getSource(compilation, callback) {
        // 走 load-runner
        // fs 模块
        // 拿源码
        compilation.inputFileSystem.readFile(this.resource, callback)
    }
}

module.exports = NormalModule;
