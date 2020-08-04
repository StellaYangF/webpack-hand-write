const path = require('path');
const fs = require('fs');
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

function createLoaderContext(options) {
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
            return loaderContext.loaders
                .slice(0, loaderContext.loaderIndex)
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

    // iterate pitching loaders
    iteratePitchingLoaders(loaderContext, finalCallback);
}

function iteratePitchingLoaders(loaderContext, finalCallback) {
    // 递归处理指针指向 loaders 中存在的 pitchFn
    // boundary handle resource
    if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
        loaderContext.loaderIndex--;
        return processResource(loaderContext, finalCallback);
    }
    // no boundary
    debugger;
    const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
    const pitchFn = currentLoaderObject.pitch;
    // handle pitchFn
    if (!pitchFn) {
        loaderContext.loaderIndex++;
        return iteratePitchingLoaders(loaderContext, finalCallback);
    }
    const args = pitchFn.call(loaderContext, loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data);
    // pitchFn returns result
    if (args) {
        loaderContext.loaderIndex --;
        return iterateNormalLoaders(loaderContext, args, finalCallback);
    } else {
        loaderContext.loaderIndex++;
        return iteratePitchingLoaders(loaderContext, finalCallback);
    }
}

function iterateNormalLoaders(loaderContext, args, finalCallback) {
    // boundary handle callback
    if (loaderContext.loaderIndex < 0) {
        return finalCallback(null, args);
    }
    
    const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
    const normalFn = currentLoaderObject.normal;
    let isSync = true;
    const innerCallback = loaderContext.callback = (err, args) => {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(loaderContext, args, finalCallback);
    };
    // user exec loaderContext.async to pause and start next iterateNormalFn
    loaderContext.async = () => {
        isSync = false;
        return innerCallback;
    };
    convertArgs(args, normalFn.raw);
    args = normalFn.call(loaderContext, args);
    if (isSync) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(loaderContext, args, finalCallback);
    } else {
        // 控制权交给开发者，调用 this.callback 就会向下执行
    }
}

function processResource(loaderContext, finalCallback) {
    let buffer = loaderContext.readResource(loaderContext.resource);
    iterateNormalLoaders(loaderContext, buffer, finalCallback);
}

function convertArgs(args, needRaw) {
    if (!needRaw && Buffer.isBuffer(args)) {
        args = args.toString('utf8');
    } else if (needRaw && typeof args === 'string') {
        args = new Buffer(args, 'utf8');
    };
    return args;
}

const finalCallback = (err, result) => {
    console.log('经过 loader 编译后的结果：', result);
}

runLoaders(options, finalCallback);