# Webpack devtool

## 有关 devtool 开发工具的属性比较

### 功能&分类

source-map 是为了解决开发代码与实际运行代码不一致的问题，帮助开发人员 debug 到开发时的源代码的一项技术。

该选项控制 source maps 的产出与否以及入户产出。

* eval 默认值，会产出 .map 文件
* source-map
* module
* cheap 不包含列信息，也不包含 loader 的 sourcemap
* inline 将 .map 作为 DataURI 嵌入，不单独生成 .map 文件

### 选用插件

* SourceMapDevToolPlugin
* EvalSourceMapDelToolPlugin

避免同时与 devtool 选项同时使用，否则会导致重复使用 plugin

### 组合配置

* none 耗时 587ms
* eval 551ms
* eval-cheap-source-map 627ms
* eval-cheap-module-source-map 939ms
* **eval-source-map** 951ms
* cheap-source-map 614ms
* cheap-module-source-map 634ms
* inline-cheap-source-map  630ms
* inline-cheap-module-source-map 823ms
* **inline-source-map** 936ms
* source-map 1172ms
* hidden-source-map 880ms
* nonesources-source-map 894ms

构建速度最快：
none, eval

构建速度最慢：
* inline-source-map 产出质量包含源代码
* source-map 含源码
* hidden-source-map
* nonesources-source-map