const loader = function(source, sourceMap) {
    console.log('loader3', this.data);
    return source + '//loader3';
};
loader.pitch = function(remainingRequest, previousRequest, data) {
    console.log('remainingRequest= ', remainingRequest);
    console.log('previousRequest= ', previousRequest);
    data.name = 'pitch';
    console.log('pitch3');
}

module.exports = loader;