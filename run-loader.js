const path = require('path');
const fs = require('fs');
const loader = require('./loaders/b-loader');
const { create } = require('domain');
const readFile = fs.readFileSync;
const join = filename => path.join(__dirname, filename);

const entry = './src/title.js';
const options = {
    resource: join(entry),
    loaders: [
        join('loaders/a-loader.js'),
        join('loaders/b-loader.js'),
        join('loaders/c-loader.js'),
    ]
};

function createLoaderObject(loaderPath) {
    const loaderObject = { data: {} };
    loaderObject.path = loaderPath;
    loaderObject.normal = require(loaderPath);
    loaderObject.pitch = loaderObject.normal.pitch;
    return loaderObject;
}

function createLoaderContext(options){
    let loaderContext = {};
    let { resource, loaders } = options;
    loaders = loaders.map(createLoaderObject);
    loaderContext.loaderIndex = 0;
    loaderContext.readResource = readFile;
    loaderContext.resource = resource;
    loaderContext.loaders = loaders;
    return loaderContext;
}

function proxyProperty(loaderContext) {
    Object.defineProperty(loaderContext, 'request', {
        get() {
            return loaderContext.loaders
                .map(loaderObject => loaderObject.path)
                .concat(loaderContext.resource)
                .join('!');
        }
    });
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get() {
            return loaderContext.loaders
                .slice(loaderContext.loaderIndex + 1)
                .map(loaderObject => loaderObject.path)
                .concat(loaderContext.resource)
                .join('!');
        }
    });
    Object.defineProperty(loaderContext, 'previousRequest', {
        get() {
            return loaderContext.loaders[0, loaderContext.loaderIndex]
                .map(loaderObject => loaderObject.path)
                .join('!');
        }
    });
    Object.defineProperty(loaderContext, 'data', {
        get() {
            return loaderContext.loaders[loaderContext.loaderIndex].data;
        }
    })
}

function runLoaders(options, finalCallback) {
    // build loaderContext
    let loaderContext = createLoaderContext(options)

    // proxy loaderContext properties
    proxyProperty(loaderContext);
}

function processResource(loaderContext, finalCallback){}

function convertArgs(args, raw) {

}

function iterateNormalLoaders(loaderContext, args, finalCallback) {

}

function iteratePitchingLoaders(loaderContext, finalCallback) {

}

const finalCallback = (err, result) => {
    console.log('经过 loader 编译后的结果：', result);
}

runLoaders(options, finalCallback);