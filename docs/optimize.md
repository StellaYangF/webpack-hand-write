# Webpack 优化

## module

该选项决定一个项目打包构建时，如何应对不同类型的模块，如：JS 模块，CSS/ SCSS/ LESS 模块，图片模块等

## 打包速度的优化

* module.noParse 跳过正则匹配到的文件，不进行解析编译，可提高构建性能

通过代码对比来看：

```js
// src/index.js

import _ from 'lodash';

console.log(_);
```

| source-map | 是否启用 noParse | 构建时间 | 代码体积 |
| --- | --- | --- | --- |
| none | 否 | 562 ms | 536 KiB |
| none | 是 | 140 ms | 534 KiB |
