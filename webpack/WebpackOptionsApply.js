const EntryOptionPlugin = require('./EntryOptionPlugin');

class WebpackOptionsApply {
    process(options, compiler) {
        new EntryOptionPlugin().apply(compiler);
    }
}

module.exports = WebpackOptionsApply;