import optionConfig from "./config";
import {isNode, isBrowser} from "./util.js";
import strBabelHelpers from "./str-babel-helpers"
import {strDevpacker, strCallbackWrap, strCheckMethod, strCheckFunction, strCheck} from './str-helpers';

const babel = !isBrowser ? require("./package/babel-6.26.0") : window.Babel;
const fs = isNode ? require('fs'): null;

const RGX_REQUIRE = /require\s*(?:\(['"]babel-runtime\/(.*?)['"]\))/g;
const RGX_REQUIRE_FILE = /(?:['|"](.*?)['|"])/;
const babelCoreJs = 'babel-runtime/core-js/';
let corejsInstance = [
    'map',
    'observable',
    'promise',
    'set',
    'symbol',
    'weak-map',
    'weak-set'
];

let already_read = [];
let installModules = [];
let babelHelpersModules = [];


/**
 * @param {string} source
 */
function _invalid_matchModuleRequire(source) {
    const m = source.match(RGX_REQUIRE);
    if (Array.isArray(m)) {
        m.forEach(path => {
            const [, file] = path.match(RGX_REQUIRE_FILE);
            if (babelHelpersModules.indexOf(file) < 0) babelHelpersModules.push(file);
        });
    }
}

/**
 * @param {string} path_base
 * @param {string[]} deps
 * @return {Promise[]}
 */
export function resolveModuleDependecy(path_base, deps) {
    return deps.map(dep => {
        if (dep.includes('./')) {
            dep = (path_base + dep.slice(1));
        }

        if (!dep.includes('.js')) {
            dep += '.js';
        }

        return loader(dep);
    }).filter(promise => (promise instanceof Promise));
}

/**
 * @param {object} babel_imports objecto de modulos requeridos
 * @return {string[]}
 */
export function objectToArrayModuleImported(babel_imports) {
    return babel_imports.filter(imports => {
        return imports.source.startsWith('./') ||
            imports.source.startsWith('/');
    }).map(imports => imports.source);
}

/**
 * @param {string} filename
 * @param {Function} callback
 * @return {any}
 */
export function reader(filename, callback) {
    return isNode ? nodeReadFile(filename,
        callback): browserReadFile(filename,
        callback);
}

/**
 * get root directory
 * @param {string} root_file
 */
export function basename(root_file) {
    const last = root_file.lastIndexOf('/');
    return ( last <= 1 ) ? '/' : root_file.slice(0, last);
}


/**
 * load file in nodejs
 * @param {string} file
 * @param {Function} callback
 */
function nodeReadFile(file, callback) {
    return fs.readFile(file, 'utf8', (err, data) => {
        callback({
            err: err,
            data
        });
    });
}

/**
 * load file in browser
 * @param {string} file
 * @param {Function} callback
 */
function browserReadFile(file, callback) {
    return fetch(file).then(response => {
        response.text().then(data => callback({
            err: false,
            data: data
        }));
    }).catch(err => callback({
        err: (err || 'error read file'),
        data: null
    }));
}

/** reset modules and babel modules required */
function resetInstallModules() {
    installModules = [];
    babelHelpersModules = [];
    already_read = [];
}

function removeRN(str) {
    return optionConfig.config.minified ? 
        str.replace(/(\n\s*|\/\/.*| \s|\n)+/g, '') :
        str;
}

/**
 * replace babel runtime module
 * @example require("babel-runtime/.*");
 * @param {string} source
 * @return {string}
 */
function replaceBabelModule(source) {
    babelHelpersModules.forEach(function(runtime) {
        if (runtime.includes(babelCoreJs)) {
            let names = runtime.replace(babelCoreJs,'').split('/')
            let fname = names[0].removeLessAndCapitalize( corejsInstance.indexOf(names[0]) >= 0 || names.length>1);
            source = source.replace(new RegExp(`(?:require\\("${runtime.replace(/\//g, '\\/')}"\\);)`, 'g'), m => {
                return 'getOrThrow.' + (names.length === 1 ? `checkFunction(global.${fname});` :`checkMethod(global.${fname}, "${names[1].removeLessAndCapitalize()}");`)
            }); 
        } else {
            source = source.replace(runtime, 'devpacker-util/helpers/'+runtime.split('/').pop())
        }
    });
    
    if (!!babelHelpersModules.find(rmt => rmt.includes(babelCoreJs)))  {
        source = 'var getOrThrow = require("devpacker-util/fn-get-or-throw");'+ (optionConfig.config.minified?'\n':'') + source;
    }
    
    return source;
}

/**
 * convert to format umd
 * @param {object[]} mods
 * @return {string}
 */
function transformCodeToUMD(mods) {
    if (!optionConfig.config.useExternalHelpers) {
        let s;
        if (!optionConfig.config.corejs&&babelHelpersModules.length) mods.push({module: 'devpacker-util/fn-get-or-throw', source: strCheck()})
        babelHelpersModules.forEach(function(runtime) {
            if (optionConfig.config.corejs && runtime.includes(babelCoreJs)) return;
            if (runtime.includes(babelCoreJs)) {
                let names = runtime.replace(babelCoreJs, '').split('/');
                let fname = names[0].removeLessAndCapitalize( corejsInstance.indexOf(names[0]) >= 0 || names.length>1);
                if (names.length === 1) {
                    s = removeRN(strCheckFunction(fname));
                } else {
                    s = removeRN(strCheckMethod(fname, names[1].removeLessAndCapitalize()));
                }
            } else {
                s = strBabelHelpers[runtime];
            }
            mods.push({module: runtime, source: s})
        })
    }
    
    var params = mods.map(({source, module}) => {
        if (!optionConfig.config.corejs) source = replaceBabelModule(source);
        return `["${isNode ? module.replace(installModules.root, '') : module}", ${strCallbackWrap(source, optionConfig.getNewLine())}]`;
    });
    
    return (`(${removeRN(strDevpacker())})(this, [${params.join(`,${optionConfig.getNewLine()}`)}])`);
}

/**
 * convert to format commonjs
 * @param {object[]} mods
 * @return {string}
 */
function transformCodeToCJS(mods) {
    var source = mods[0].source;
    if (!optionConfig.config.corejs) {
        source = replaceBabelModule(source);
    }
    return source;
}

/**
 * convert to format umd
 * @throws {Error}
 * @return {string}
 */
function transformCode() {
    var code;
    
    installModules.reverse();
    
    if (optionConfig.config.format === 'umd') {
        code = transformCodeToUMD(installModules);
    } else if (optionConfig.config.format === 'cjs') {
        code = transformCodeToCJS(installModules);
    } else {
        throw `the out format ${optionConfig.config.format} is invalid`;
    }
    
    resetInstallModules();
    
    return code;
}

/**
 * load file(s) and transform code  
 * @param {string} filename
 * @return {Promise}
 */
export function loader(filename) {
    if (already_read.indexOf(filename) >=0) return;
    already_read.push(filename);
    return new Promise((resolve) => {
        reader(filename, function(es) {
            const err = es.err;
            const data = es.data;
            if (err) return console.error(err);
            const transform = babel.transform(data, optionConfig.getCompileOptions().babel);
            const childs = objectToArrayModuleImported(transform.metadata.modules.imports);
            const solve = {
                module: filename,
                source: transform.code,
                deps: []
            };
            
            _invalid_matchModuleRequire(solve.source);
            if (optionConfig.config.format === 'umd') {
                solve.deps = resolveModuleDependecy(basename(filename), childs);
            }
            
            if (!installModules.root) {
                installModules.root = isNode ? process.cwd() : basename(filename);
            }
            
            solve.deps = Promise.all(solve.deps);
            solve.deps.then(values => {
                resolve(solve);
                return values
            })
        });
    }).then(solve =>{
        if (solve) installModules.push(solve);
    })
}

export function generator(loader) {
    return loader.then(transformCode);
}

export const VERSION = '0.3.11';

export {optionConfig};