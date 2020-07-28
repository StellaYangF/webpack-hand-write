# Webpack Loader

## Content

* What
* Why & Where
* work flow

### What is Loader

loader 就是一个个的加载器，主要功能是协助 Webpack 在解析模块资源时，将原有的不同模块通过相应的预处理器转译成 JS 模块。

### Why & Where

Webpack 默认情况只能识别 JS 模块，在分析资源依赖关系时，碰到非 JS 模块时，就需要通过相应的 loader 来加载处理内容。

### work flow

Loader 的运行流程如下：

* Compiler.js （一整个 Webpack）合并用户配置和默认配置，包括 module.rules[index]loader 部分;
* compiler 调用 `compile` 方法开始本次编译，内部首先调用 `newCompilationParams`，创建一个 `NormalModuleFactory`，它用来创建 NormalModule
* 普通模块工厂创建 NormalModule 之前，通过 loader 的 resolver 来解析 loader 路径
* 普通模块工厂创建 NormalModule 之后，包含了 _resource 和 _ast 等属性，执行其 build 方法构建模块加载原来的模块内容
* loader-runner 是 webpack 中 loader 的运行期，一个模块可能有多个 loader
* 最后，将 loader 处理完的模块内容输出，进入后续的编译流程。

![loader-work-flow](./assets/loader-work-flow.jpg)

## Customized Loader

### Content

* 使用自定义 loader 引用方式
* babel-loader 实现
* file-loader 实现
* 总结

自定义 Loader 的编写通过 Node.js 实现，遵循 commomjs 规范。
官方定义 loader 会导出一个 loader 函数，上面还可挂载多个属性。

### 使用自定义 loader 引用方式

* resolveLoader
    * alias: 'loader-name': path.resolve(__dirname, 'loaders/loader.name.js')
    * modules: [ path.resolve(__dirname, 'loaders'), 'node_modules' ]
* resolve 同上
    * alias
    * modules
* npm link 建立当前 loader 库包的软连接


### babel-loader 实现

需要依赖 @babel/preset-env 和 @babel/core 两个库来实现 ES6/7/... 向低版本 ES 语法的转换。

[参考](https://babeljs.io/docs/en/configuration#using-the-api-babel-core)

执行 require('@babel/core').transform 核心方法，传入 options 即可。

```js
const babel = require('@babel/core);

function loader(source, inputSourceMap, ast) {
    const options = {
        presets: ['@babel/preset-env'],
        inputSourceMap,
        sourceMaps: true,
        filename: this.request.split('!').pop().split('/').pop(),
    };
    const {code, map, ast} = babel.transform(source, options);
    return code;
}

module.exports = loader;
```

### file-loader


### 总结

loader 函数也是一个对象，loader-runner 调用，执行上下文 this 指向 loaderContext

loaderContext 上有一系列属性:

* `emitFile` 产出文件函数
* `request` /loaders/babel-loader.js **!**/src/index.js 
* `userRequest` /src/index.js
* `rawRequest` ./src/index.js
* `resourcePath` /src/index.js


## Fulfill Loader

