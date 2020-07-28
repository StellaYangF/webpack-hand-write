const NormalModuleFactory = require("./NormalModuleFactory");
const Parser = require('./Parser');
const async = require('neo-async'); // 并发执行异步任务，类似 Promise.all()
const { Tapable, SyncHook } = require('tapable');
const path = require('path');

let parser = new Parser();

class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.options = compiler.options;
        this.context = compiler.context;
        this.modules = [];
        this.entries = [];
        this._modules = {}; // key 模块 ID 值 模块对象
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.hooks = {
            succeedModule: new SyncHook(['module'])
        }
    }

    addEntry(context, entry, name, callback) {
        this._addModuleChain(context, entry, name, (err, module) => {
            callback(err, module);
        })
    }

    _addModuleChain(context, entry, name, callback) {
        this.build({
            name,
            context: this.context,
            rawRequest: entry,
            resource: path.posix.join(context, entry),
            parser,
        }, module => {
            this.entries.push(module);
        }, callback)
    }
    build(data, addEntry, callback) {
        // 创建模块工厂
        const moduleFactory = new NormalModuleFactory();
        const module = moduleFactory.create(data);
        // ***重要*** 模块　ID　如何生成：相对于根目录的相对路径
        //  index.js ./src/index.js  title.js: ./src/title.js
        // path.posix.sep 分隔符
        // relative 返回一个相对路径，从根目录出发到模块的绝对路径，得到一个相对路径
        module.moduleId = `.${path.posix.sep}${path.posix.relative(this.context, module.resource)}`;
        this._modules[moduleId] = 
        addEntry &&  addEntry(module);
        this.modules.push(module);
        const afterBuild = (err, module) => {
            console.log('afterBuild', module);
            callback(err, module);
            if (module.dependencies) {
                // 有依赖，递归编译依赖模块
                this.processModuleDependencies(module, err => {
                    // 入口模块和依赖模块都编译完成，才会入口模块的回调
                    callback(err, module);
                })
            }
        }
        this.buildModule(module, afterBuild);
    }
    processModuleDependencies(module, callback){
        let dependencies = module.dependencies;
        async.forEach(dependencies, (dependency, done) => {
            let { moduleId, name, context, rawRequest, resource } = dependency;
            let module = moduleFactory.create({
                name,
                context,
                rawRequest,
                resource,
                moduleId,

            })
        }, callback)
    }
    buildModule(module, afterBuild) {
        module.build(this, err => {
            // 模块编译靠模块自己实现
            this.hooks.succeedModule.call(module);
            afterBuild(null, module);
        })
    }
}

module.exports = Compilation;