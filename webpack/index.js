const NodeEnvironmentPlugin = require("./NodeEnvironmentPlugin");
const WebpackOptionsApply = require('./WebpackOptionsApply');
const Compiler = require('./compiler');

function webpack(options) {
    options.context = options.context || path.resolve(process.cwd());
    // 合并配置文件
    let compiler = new Compiler(options.context);
    // 合并 compiler 默认参数对象和传入的配置文件进行合并
    compiler.options = Object.assign(compiler.options, options);
    // webpack 读写用 fs; 但热更新时，webpack-dev-server memory-fs 写在内存中
    new NodeEnvironmentPlugin().apply(compiler);
    // 挂载插件
    if (options.plugins && Array.isArray(options.plugins)) {
        options.plugins.forEach(plugin => plugin.apply(compiler));
    }
    // 挂载默认插件
    new WebpackOptionsApply().process(options, compiler);
    return compiler;
}

module.exports = webpack;