# Webpack Hand-written

## webpack-cli
 
### 个人理解

webpack-cli 既可以通过 cli 命令行，也可通过脚本形式调用 webpack 进行工程编译。

### 流程
  
* 引入 **webpack** 核心方法（webpack 本质就是一个方法）
* 引入 config 文件，获取 **options**（开发者自定义提供）
* 执行 `webpack(options)`，返回 **compiler** 编译器，就是 Compiler 的类实例
* 执行 `compiler.run(callback)`，传入接收 **err**, **stats** 两个参数
* callback 内部打印出编译成功后的 stats 信息，可选。

### 实现

  ```js
  const webpack = require('webpack');
  const options = require('./webpack.config');

  const compiler = webpack(options);
  compiler.run((err, stats) => {
      console.log(err);
      const json = stats.toJson({
          entrypoints: true,
          chunks: true,
          modules: true, // 数组模式
          _modules: true, // 对象方式
          assets: true,
      });
      console.log(JSON.stringify(json, null, 2));
  })
  ```

## webpack

### 个人理解

webpack 本质是一个函数，函数签名为，接收一个 options 参数，这个参数是开发者提供的，用于自定义自己的编译构建流程；返回值是一个 **Compiler** 类实例，上面挂在多个编译构建流会用到的 **hooks**，继承自 **Tapable**

### 大概流程

* 合并配置文件，webpack 中存在三种方式定义的 options，分别是：
  * 开发者定义的 webpack.config.js
  * cli 命令行传入的参数
  * webpack 内部定义的默认配置
* 初始化配置中的 context 上下文，就是当前执行的根目录（是一个绝对路径）
* **NodeEnvironmentPlugin** Node 环境插件，准备 apply 实例方法，接受 compiler ，为 compiler 增加 **inputFileSystem** 和 **outputFileSystem** 的读写操作功能（就是 fs-File-System）
  * fs 是写入硬盘中的
  * **热更新**，**webpack-dev-server** 用到的是 memory-fs，读写操作在内存中
* 挂载配置文件提供的 plugins，迭代调用 **plugin.apply** 传入 compiler
* 返回 compiler 实例

## webpack plugin

### 个人理解

webpack 内部提供了多个插件，用于增强 compiler 的功能，同时允许开发者构建自己的插件，集成 webpack ，都遵循下面的特性：

* 每个插件都是一个 class 类
* 提供 `apply` 实例方法，接收 compiler，在这个方法内部为 compiler 增强功能

下面会一一谈到 webpack 内置的插件。

### NodeEnvironmentPlugin

NodeEnvironmentPlugin 为 compiler 增加读写功能

  ```js
  const fs = require('fs');

  class NodeEnvironmentPlugin {
      constructor(options) {
          this.options = options || {};
      }
      apply(compiler) {
          compiler.inputFileSystem = fs;
          compiler.outputFileSystem = fs;
      }
  }

  module.exports = NodeEnvironmentPlugin;
  ```

### WebpackOptionsApply

提供 process 方法，内部统一挂载 webpack 内置的插件
  ```js
  const EntryOptionPlugin = require('./EntryOptionPlugin');

  class WebpackOptionsApply {
      process(options, compiler) {
          new EntryOptionPlugin().apply(compiler);
      }
  }

  module.exports = WebpackOptionsApply;
  ```

### EntryOptionPlugin

内部监听了 entryOptions 钩子函数，执行回调内部，新建 **SingleEntryPlugin** 实
例

  ```js
  const SingleEntryPlugin = require("./SingleEntryPlugin");

  class EntryOptionPlugin{
      apply(compiler) {
          // 当有一个 entryOption 事件钩子触发时，执行回调，传入 context 和 entry
          compiler.hooks.entryOptions.tap('EntryOptionPlugin', (context, entry) => {
              // 创建 SingleEntryPlugin
              new SingleEntryPlugin(context, entry, 'main').apply(compiler);
          })
      }
  }

  module.exports = EntryOptionPlugin;
  ```

### SingleEntryPlugin

内部监听 make 事件，这个插件比较重要，compiler.compiler 启动编译时，会触发这个 make 监听的钩子函数

  ```js
  class SingleEntryPlugin {
      /**
       * 
       * @param {*} context 根目录 绝对路径
       * @param {*} entry 入口文件 index.js
       * @param {*} name 入口 别名 main
       */
      constructor(context, entry, name) {
          this.context = context;
          this.entry = entry;
          this.name = name;
      }

      apply(compiler) {
          // 监听 make 事件
          compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
              console.log(callback);
              // callback 表示一个钩子函数完成了（内部计数器），等所有注册的钩子函数结束后，才会执行
              console.log('开始编译入口', this.entry);
              // 开始真正编译入口 entry
              // compilation.addEntry(this.context, this.entry, this.name, callback);
          })
      }
  }

  module.exports = SingleEntryPlugin;
  ```

下面是 compiler.compile 内部触发的部分代码

  ```js
  this.hooks.compile.call(params);
  let compilation = this.newCompilation(params);
  // make 让所有的入口同时开始编译，全部编译后才执行 omCompiled
  // 第二参数是一个函数，被称为最终的回调
  this.hooks.make.callAsync(compilation, err => { // make 成功后的回调
      // 凡是注册了 make 钩子的函数全部成功了，才会触发这个回调 callback
      // 类似：Promise.resolve().then(err => {})
      onCompiled(err, compilation);
  })
  ```