const loader = function(source, sourceMap) {
    console.log('loader2', this.data);
    return source + '//loader2';
};
loader.pitch = function(remainingRequest, previousRequest, data) {
    console.log('remainingRequest= ', remainingRequest);
    console.log('previousRequest= ', previousRequest);
    data.name = 'pitch';
    console.log('pitch2');
}

module.exports = loader;