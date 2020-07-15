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