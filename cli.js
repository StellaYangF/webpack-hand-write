const webpack = require('./webpack');
// const webpack = require('webpack');
const options = require('./webpack.config');
debugger;
const compiler = webpack(options);
debugger;
compiler.run((err, stats) => {
    console.log(stats);
    // const json = stats.toJson({
    //     entrypoints: true,
    //     chunks: true,
    //     modules: true, // 数组模式 []
    //     _modules: true, // 对象方式
    //     assets: true,
    // });
    // console.log(JSON.stringify(json, null, 2));
})