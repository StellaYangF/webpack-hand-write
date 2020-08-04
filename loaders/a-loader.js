const loader = function(source, sourceMap) {
    console.log('loader1', this.data);
    return source + '//loader1';
};
loader.pitch = function(remainingRequest, previousRequest, data) {
    data.name = 'pitch';
    console.log('pitch1');
}

module.exports = loader;