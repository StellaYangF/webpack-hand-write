const loader = function(source, sourceMap) {
    return source + '//loader1';
};
loader.pitch = function(remainingRequest, previousRequest, data) {
    data.name = 'pitch';
    console.log('pitch1');
}

module.exports = loader;