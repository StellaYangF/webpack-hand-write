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