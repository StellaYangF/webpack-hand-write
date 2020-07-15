// 写插件时可能会用到文件信息

let stats = {
    errors: [],
    warnings: [],
    version: '4.43.0',
    hash: '81d0e581e39795f6d83b', // hahs
    time: 111,
    builtAt: 1594814998452,
    publicPath: '',
    outputPath: 'E:\\0-前端\\00-框架\\webpack\\hand\\dist',
    assetsByChunkName: { main: 'main.js' },
    assets: [ // 产出哪些文件
      {
        name: 'main.js',
        size: 4544,
        chunks: [Array],
        chunkNames: [Array],
        info: {},
        emitted: true, // 是否写入硬盘
        isOverSizeLimit: undefined
      }
    ],
    filteredAssets: 0,
    entrypoints: { // 入口点
      main: {
        chunks: [Array], // main
        assets: [Array], // main.js
        // children: [Object: null prototype] {},
        // childAssets: [Object: null prototype] {},
        // isOverSizeLimit: undefined
      }
    },
    namedChunkGroups: { 
    // webpack4 中新增概念 chunkGroup 用于合并或分割 
    // splitChunks 会用到
      main: {
        chunks: [Array],
        assets: [Array],
        // children: [Object: null prototype] {},
        // childAssets: [Object: null prototype] {},
        // isOverSizeLimit: undefined
      }
    },
    chunks: [
      {
        id: 'main', // chunkid
        rendered: true, // 是否生成如渲染
        initial: true, // 是否初始化模块（放在main.js 中） 区别于 import() 
        entry: true,
        // recorded: undefined,
        // reason: undefined,
        size: 72,
        names: [Array],
        files: [Array],
        hash: '8a3235329237ec9f4f9a', // chunkHash 生成自己的 hash
        siblings: [], // 子代码块
        parents: [],
        children: [],
        // childrenByOrder: [Object: null prototype] {},
        modules: [Array], // 该代码块中包含哪些模块
        // filteredModules: 0,
        // origins: [Array]
      }
    ],
    modules: [
      {
        id: './src/hello.js',
        identifier: 'E:\\0-前端\\00-框架\\webpack\\hand\\src\\hello.js', // 次模块打包前的绝对路径
        name: './src/hello.js', // 一般和 id 一致
        index: 1, // 从 0 开始
        index2: 0, // 从1开始
        size: 23,
        cacheable: true,
        built: true,
        optional: false,
        prefetched: false, //预获取 preload 预加载
        chunks: [Array], // module chunk 多对多关系
        // issuer: 'E:\\0-前端\\00-框架\\webpack\\hand\\src\\index.js', // 哪个模块依赖我，导致被打包进来，放置绝对路径
        // issuerId: './src/index.js',
        // issuerName: './src/index.js',
        // issuerPath: [Array],
        // profile: undefined,
        failed: false,
        errors: 0,
        warnings: 0,
        assets: [],
        reasons: [Array], // 由于什么原因此模块被打包进来
        providedExports: [Array],
        optimizationBailout: [], // 失败说明
        depth: 1, // 类似于辈分：入口为 0 儿子 1 孙子2
        source: 'export default "hello";' // 源码
      },
      {
        id: './src/index.js',
        identifier: 'E:\\0-前端\\00-框架\\webpack\\hand\\src\\index.js',
        name: './src/index.js',
        index: 0,
        index2: 1,
        size: 49,
        cacheable: true,
        built: true,
        optional: false,
        prefetched: false,
        chunks: [Array],
        issuer: null,
        issuerId: null,
        issuerName: null,
        issuerPath: null,
        profile: undefined,
        failed: false,
        errors: 0,
        warnings: 0,
        assets: [],
        reasons: [Array],
        providedExports: [],
        optimizationBailout: [],
        depth: 0,
        source: "import hello from './hello';\r\nconsole.log(hello);"
      }
    ],
    filteredModules: 0,
    logging: {
      'webpack.buildChunkGraph.visitModules': { entries: [], filteredEntries: 2, debug: false }
    },
    children: []
  }