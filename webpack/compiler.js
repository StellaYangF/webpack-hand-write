const { Tapable, SyncBailHook, AsyncParallelHook, SyncHook, AsyncSeriesHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Compilation = require('./Compilation');

class Compiler extends Tapable {
    constructor(context) {
        super();
        this.hooks = { // compiler 实例上会挂在很多钩子
            // 入口选项 解析入口 
            // 同步钩子
            entryOptions: new SyncBailHook(['context', 'entry']),
            // 真正开启构建流程 
            // 异步并行钩子
            make: new AsyncParallelHook(['compilation']),
            beforeRun: new AsyncSeriesHook(['compiler']), // 运行前
            run: new AsyncSeriesHook(['compiler']), // 运行
            beforeCompile: new SyncBailHook(['params']), // 编译前
            compile: new SyncHook(['params']), // 编译
            thisCompilation: new SyncHook(['compilation', 'params']),// 启动一次新的编译
			compilation: new SyncHook(["compilation", "params"]),
            done: new AsyncSeriesHook(['stats']),
        }
        this.context = context; // compiler.context = 当前工作目录
        this.options = {};
    }

    run(callback) {
       const onCompiled = (err, compilation) => {
           callback(null, {}); // {} stats
       };
       this.hooks.beforeRun.callAsync(this, err => {
        this.hooks.run.callAsync(this, err => {
            this.compile(onCompiled); // 编译成功后调用 callback
        });
       })
    }

    compile(onCompiled) {
        const params = this.newCompilationParams();// 创建 compilation 参数
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params);
            let compilation = this.newCompilation(params);
            // make 让所有的入口同时开始编译，全部编译后才执行 omCompiled
            // 第二参数是一个函数，被称为最终的回调
            this.hooks.make.callAsync(compilation, err => { // make 成功后的回调
                // 凡是注册了 make 钩子的函数全部成功了，才会触发这个回调 callback
                // 类似：Promise.resolve().then(err => {})
                onCompiled(err, compilation);
            })
        })
    }

    newCompilation(params) {
        const compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }

    newCompilationParams() {
        return {
            // 模块工厂来创建模块，如：index.js 及其依赖
            normalModuleFactory: new NormalModuleFactory(),
        }
    }
}

module.exports = Compiler;
