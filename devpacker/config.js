var defaultConfig = {
    format: 'umd',
    minified: false,
    useExternalHelpers: false,
    corejs: false
}

var formats = ['umd', 'cjs'];

var appConfig = Object.assign({}, defaultConfig);

function assign(target, assgn) {
    for (var key in assgn) {
        if (target.hasOwnProperty(key)) {
            if (typeof assgn[key] === 'object') {
                target[key] = assign(target[key], assgn[key]);
            } else {
                target[key] = assgn[key];
            }
        }
    }    
    
    return target;
}

var config = {
    setConfig: function (cf) {
        this.config = assign(appConfig, cf);
    },
    getCompileOptions: function() {
        var options = this.config;

        var opt = {
            presets: ['es2015', 'stage-0', 'react'], 
            plugins: [], 
            minified: options.minified
        }, corejs;
        
        if (options.useExternalHelpers && formats.indexOf(options.format)>=0) {
            opt.plugins.push('external-helpers');
        } else {
            opt.plugins.push('transform-runtime');
            corejs = options.corejs;
        }
    
        return {
            babel: opt,
            corejs: corejs
        }
    }
}

Object.defineProperty(config, 'config', {
   enumerable: true, 
    get: function () {
        return appConfig;
    },
    set: function (nwconfig) {
        appConfig = assign(appConfig, nwconfig);
    }
});

export default config;