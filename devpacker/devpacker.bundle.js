(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.devpacker = {}));
}(this, (function (exports) { 'use strict';

    var defaultConfig = {
        format: 'umd',
        minified: false,
        useExternalHelpers: false,
        corejs: false
    };

    var formats = ['umd', 'cjs'];

    var appConfig = Object.assign({}, defaultConfig);

    /**
     * @url https://github.com/jamiebuilds/babel-plugin-remove-comments
     */
    Babel.registerPlugin('remove-comments', function(o) {
        var t = o.types;
        return {
            visitor: {
                Program: function (path, state) {
                    path.traverse({
                        enter: function (path) {
                            t.removeComments(path.node);
                        }
                    });
                }
            }
        };
    });

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
                presets: ['es2015','stage-0','react'],
                plugins: [],
                minified: options.minified
            }, corejs;

            if (options.minified) {
                opt.plugins.push('remove-comments');
            }

            if (options.useExternalHelpers && formats.indexOf(options.format) >= 0) {
                opt.plugins.push('external-helpers');
            } else {
                opt.plugins.push('transform-runtime');
                corejs = options.corejs;
            }

            return {
                babel: opt,
                corejs: corejs
            }
        },
        getNewLine: function () {
            return !this.config.minified ? '\n' : '';
        }
    };

    Object.defineProperty(config, 'config', {
        enumerable: true,
        get: function () {
            return appConfig;
        },
        set: function (nwconfig) {
            appConfig = assign(appConfig, nwconfig);
        }
    });

    const isNode = typeof module === 'object' && typeof module.exports === 'object';

    const isBrowser = typeof window === 'object';

    const existsGlobalObject = typeof global === 'object';

    String.prototype.removeLessAndCapitalize = function(frombeginning) {
        let nw = this;
        if (frombeginning===true) {
            nw = this[0].toUpperCase() + this.slice(1);
        }
        return nw.replace(/-[a-z]/g, m => m.slice(1).toUpperCase())
    };

    // invoke
    var _typeof = function () {
        return (typeof Symbol === "function" && typeof Symbol.iterator === "symbol")
        ? function (obj) {
            return typeof obj;
        }
        : function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
            ? "symbol": typeof obj;
        };
    };

    // invoke
    var jsx = (function () {
        var REACT_ELEMENT_TYPE = (typeof Symbol === "function" && Symbol.for && Symbol.for("react.element")) || 0xeac7;

        return function createRawReactElement (type, props, key, children) {
            var defaultProps = type && type.defaultProps;
            var childrenLength = arguments.length - 3;

            if (!props && childrenLength !== 0) {
                // If we're going to assign props.children, we create a new object now
                // to avoid mutating defaultProps.
                props = {};
            }
            if (props && defaultProps) {
                for (var propName in defaultProps) {
                    if (props[propName] === void 0) {
                        props[propName] = defaultProps[propName];
                    }
                }
            } else if (!props) {
                props = defaultProps || {};
            }

            if (childrenLength === 1) {
                props.children = children;
            } else if (childrenLength > 1) {
                var childArray = Array(childrenLength);
                for (var i = 0; i < childrenLength; i++) {
                    childArray[i] = arguments[i + 3];
                }
                props.children = childArray;
            }

            return {
                $$typeof: REACT_ELEMENT_TYPE,
                type: type,
                key: key === undefined ? null: '' + key,
                ref: null,
                props: props,
                _owner: null,
            };
        };
    });


    var asyncIterator = (function (iterable) {
        if (typeof Symbol === "function") {
            if (Symbol.asyncIterator) {
                var method = iterable[Symbol.asyncIterator];
                if (method != null) return method.call(iterable);
            }
            if (Symbol.iterator) {
                return iterable[Symbol.iterator]();
            }
        }
        throw new TypeError("Object is not async iterable");
    });

    // invoke
    var asyncGenerator = (function () {
        function AwaitValue(value) {
            this.value = value;
        }

        function AsyncGenerator(gen) {
            var front,
            back;

            function send(key, arg) {
                return new Promise(function (resolve, reject) {
                    var request = {
                        key: key,
                        arg: arg,
                        resolve: resolve,
                        reject: reject,
                        next: null
                    };

                    if (back) {
                        back = back.next = request;
                    } else {
                        front = back = request;
                        resume(key, arg);
                    }
                });
            }

            function resume(key, arg) {
                try {
                    var result = gen[key](arg);
                    var value = result.value;
                    if (value instanceof AwaitValue) {
                        Promise.resolve(value.value).then(
                            function (arg) {
                                resume("next", arg);
                            },
                            function (arg) {
                                resume("throw", arg);
                            });
                    } else {
                        settle(result.done ? "return": "normal", result.value);
                    }
                } catch (err) {
                    settle("throw", err);
                }
            }

            function settle(type, value) {
                switch (type) {
                    case "return":
                        front.resolve({
                            value: value, done: true
                        });
                        break;
                    case "throw":
                        front.reject(value);
                        break;
                    default:
                        front.resolve({
                            value: value, done: false
                        });
                        break;
                }

                front = front.next;
                if (front) {
                    resume(front.key, front.arg);
                } else {
                    back = null;
                }
            }

            this._invoke = send;

            // Hide "return" method if generator return is not supported
            if (typeof gen.return !== "function") {
                this.return = undefined;
            }
        }

        if (typeof Symbol === "function" && Symbol.asyncIterator) {
            AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
                return this;
            };
        }

        AsyncGenerator.prototype.next = function (arg) {
            return this._invoke("next", arg);
        };
        AsyncGenerator.prototype.throw = function (arg) {
            return this._invoke("throw", arg);
        };
        AsyncGenerator.prototype.return = function (arg) {
            return this._invoke("return", arg);
        };

        return {
            wrap: function (fn) {
                return function () {
                    return new AsyncGenerator(fn.apply(this, arguments));
                };
            },
            await: function (value) {
                return new AwaitValue(value);
            }
        };

    });


    var asyncGeneratorDelegate = (function (inner, awaitWrap) {
        var iter = {},
        waiting = false;

        function pump(key, value) {
            waiting = true;
            value = new Promise(function (resolve) {
                resolve(inner[key](value));
            });
            return {
                done: false,
                value: awaitWrap(value)
            };
        }
        if (typeof Symbol === "function" && Symbol.iterator) {
            iter[Symbol.iterator] = function () {
                return this;
            };
        }

        iter.next = function (value) {
            if (waiting) {
                waiting = false;
                return value;
            }
            return pump("next", value);
        };

        if (typeof inner.throw === "function") {
            iter.throw = function (value) {
                if (waiting) {
                    waiting = false;
                    throw value;
                }
                return pump("throw", value);
            };
        }

        if (typeof inner.return === "function") {
            iter.return = function (value) {
                return pump("return", value);
            };
        }

        return iter;
    });


    var asyncToGenerator = (function (fn) {
        return function () {
            var gen = fn.apply(this, arguments);
            return new Promise(function (resolve, reject) {
                function step(key, arg) {
                    try {
                        var info = gen[key](arg);
                        var value = info.value;
                    } catch (error) {
                        reject(error);
                        return;
                    }

                    if (info.done) {
                        resolve(value);
                    } else {
                        return Promise.resolve(value).then(function (value) {
                            step("next", value);
                        }, function (err) {
                            step("throw", err);
                        });
                    }
                }

                return step("next");
            });
        };
    });


    var classCallCheck = (function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    });

    // invoke
    var createClass = (function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i ++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    });


    var defineEnumerableProperties = (function (obj, descs) {
        for (var key in descs) {
            var desc = descs[key];
            desc.configurable = desc.enumerable = true;
            if ("value" in desc) desc.writable = true;
            Object.defineProperty(obj, key, desc);
        }
        return obj;
    });


    var defaults = (function (obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);
            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }
        return obj;
    });


    var defineProperty = (function (obj, key, value) {
        // Shortcircuit the slow defineProperty path when possible.
        // We are trying to avoid issues where setters defined on the
        // prototype cause side effects under the fast path of simple
        // assignment. By checking for existence of the property with
        // the in operator, we can optimize most of this overhead away.
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    });


    var _extends = Object.assign || (function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    });


    var get = (function get(object, property, receiver) {
        if (object === null) object = Function.prototype;

        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    });


    var inherits = (function (subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass): subClass.__proto__ = superClass;
    });


    var _instanceof = (function (left, right) {
        if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
            return right[Symbol.hasInstance](left);
        } else {
            return left instanceof right;
        }
    });


    var interopRequireDefault = (function (obj) {
        return obj && obj.__esModule ? obj: {
            default: obj
            };
    });


    var interopRequireWildcard = (function (obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};
            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }
            newObj.default = obj;
            return newObj;
        }
    });


    var newArrowCheck = (function (innerThis, boundThis) {
        if (innerThis !== boundThis) {
            throw new TypeError("Cannot instantiate an arrow function");
        }
    });


    var objectDestructuringEmpty = (function (obj) {
        if (obj == null) throw new TypeError("Cannot destructure undefined");
    });


    var objectWithoutProperties = (function (obj, keys) {
        var target = {};
        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }
        return target;
    });


    var possibleConstructorReturn = (function (self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return call && (typeof call === "object" || typeof call === "function") ? call: self;
    });


    var selfGlobal = typeof global === "undefined" ? self: global;


    var set = (function (object, property, value, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent !== null) {
                set(parent, property, value, receiver);
            }
        } else if ("value" in desc && desc.writable) {
            desc.value = value;
        } else {
            var setter = desc.set;

            if (setter !== undefined) {
                setter.call(receiver, value);
            }
        }

        return value;
    });

    // invoke
    var slicedToArray = (function () {
        // Broken out into a separate function to avoid deoptimizations due to the try/catch for the
        // array iterator case.
        function sliceIterator(arr, i) {
            // this is an expanded form of \`for...of\` that properly supports abrupt completions of
            // iterators etc. variable names have been minimised to reduce the size of this massive
            // helper. sometimes spec compliancy is annoying :(
            //
            // _n = _iteratorNormalCompletion
            // _d = _didIteratorError
            // _e = _iteratorError
            // _i = _iterator
            // _s = _step

            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);
                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    });


    var slicedToArrayLoose = (function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            var _arr = [];
            for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
                _arr.push(_step.value);
                if (i && _arr.length === i) break;
            }
            return _arr;
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    });


    var taggedTemplateLiteral = (function (strings, raw) {
        return Object.freeze(Object.defineProperties(strings, {
            raw: {
                value: Object.freeze(raw)
            }
        }));
    });


    var taggedTemplateLiteralLoose = (function (strings, raw) {
        strings.raw = raw;
        return strings;
    });


    var temporalRef = (function (val, name, undef) {
        if (val === undef) {
            throw new ReferenceError(name + " is not defined - temporal dead zone");
        } else {
            return val;
        }
    });


    var temporalUndefined = {};


    var toArray = (function (arr) {
        return Array.isArray(arr) ? arr: Array.from(arr);
    });


    var toConsumableArray = (function (arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        } else {
            return Array.from(arr);
        }
    });

    var babelHelpers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        _typeof: _typeof,
        jsx: jsx,
        asyncIterator: asyncIterator,
        asyncGenerator: asyncGenerator,
        asyncGeneratorDelegate: asyncGeneratorDelegate,
        asyncToGenerator: asyncToGenerator,
        classCallCheck: classCallCheck,
        createClass: createClass,
        defineEnumerableProperties: defineEnumerableProperties,
        defaults: defaults,
        defineProperty: defineProperty,
        _extends: _extends,
        get: get,
        inherits: inherits,
        _instanceof: _instanceof,
        interopRequireDefault: interopRequireDefault,
        interopRequireWildcard: interopRequireWildcard,
        newArrowCheck: newArrowCheck,
        objectDestructuringEmpty: objectDestructuringEmpty,
        objectWithoutProperties: objectWithoutProperties,
        possibleConstructorReturn: possibleConstructorReturn,
        selfGlobal: selfGlobal,
        set: set,
        slicedToArray: slicedToArray,
        slicedToArrayLoose: slicedToArrayLoose,
        taggedTemplateLiteral: taggedTemplateLiteral,
        taggedTemplateLiteralLoose: taggedTemplateLiteralLoose,
        temporalRef: temporalRef,
        temporalUndefined: temporalUndefined,
        toArray: toArray,
        toConsumableArray: toConsumableArray
    });

    const todo = {
        'babel-runtime/regenerator': checkVarGlobalRuntimeRegenerator(isNode && existsGlobalObject ? 'global' : isBrowser ? 'window' : 'this')
    };

    const babelBaseHelper = 'babel-runtime/helpers/';

    const invokeCallback = [
        'jsx',
        '_typeof',
        'asyncGenerator',
        'createClass',
        'slicedToArray'
    ];

    for (var key in babelHelpers) {
        todo[babelBaseHelper + (key.startsWith('_') ? key.slice(1) : key)] = $exports(key, invokeCallback.indexOf(key)>=0);
    }

    function $exports(key, invk) {
        return 'module.exports = '+ babelHelpers[key] + (invk?'();':'');
    }

    function checkVarGlobalRuntimeRegenerator($var) {
        return `if (typeof ${$var}.regeneratorRuntime === 'object') return (module.exports = ${$var}.regeneratorRuntime);
    throw "the var regeneratorRuntime is not defined, add babel-polyfill 6.26.0";`;
    }

    /**
     * devpacker
     */
    function __devpacker__($global, arr_modules) {
        var isNode = (typeof require === 'function' && typeof module === 'object' && typeof module.exports === 'object'); 
        defineGlobal();
        // iterate modules
        for (var i = 0, modules = {}; i < arr_modules.length; i++) {
            __devpacker__define_module(arr_modules[i][0], arr_modules[i][1]);
        }
        // execute main file
        var _exports = modules[arr_modules[0][0]]();
        // exports global module
        if (isNode) {
            module.exports = _exports;
        } else if (typeof define === 'function' && define.amd) {
            define(['exports'], exportProperties);
        } else {
            exportProperties($global);
        }
        // define properties to the target element
        function exportProperties(target) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(_exports));
        }
        // create key global if not exists
        function defineGlobal() {
            if (!("global" in $global)) $global.global = $global;
        }

        function __devpacker__define_module(moduleId, wrapper) {

            function __Devpacker__Module(filename) {
                this.filename = filename;
                this.path = filename.slice(0, filename.lastIndexOf('/'));
                this.module = {exports: {}};
                this.children = [];

                this.require = function (modulepath) {
                    var startsWith = modulepath.startsWith('./');
                    var root = startsWith ? (this.path + modulepath.slice(1)): modulepath;
                    if (startsWith && !root.endsWith('.js')) (root += '.js');
                    if (root in modules) {
                        if (this.children.indexOf(root) < 0) {
                            this.children.push(root);
                        }
                        return modules[root]();
                    } else if (isNode) {
                        return require(modulepath);
                    }
                    throw new ReferenceError('module '+ root +' not exists');
                };
            }

            function __devpacker_wrap_invoke(module_wrap) {
                module_wrap(this.require.bind(this), this.module, this.module.exports);
                return this.module.exports;
            }

            var module = new __Devpacker__Module(moduleId);
            modules[moduleId] = __devpacker_wrap_invoke.bind(module, wrapper);
        }
    }

    function checkMethod($class, $method) {
        checkFunction($class);
        
        function _throw(exists) {
            if(exists === false) throw `${$class}.${$method} not exists`;
        }
        
        return function (o) {
            var ts = $class && typeof $class[$method] === 'function' ? $class[$method] : false,
                tp = $class && typeof $class.prototype[$method] === 'function' ? $class.prototype[$method] : false;
            _throw((ts||tp));
            return ((ts || tp) ? (ts||tp).apply(o, Array.prototype.slice.call(arguments, 1)) :
                $class[$method]);
        }
    }

    function checkFunction(fn) {
        if (typeof fn === 'function') return fn;
        throw `function ${fn} is not defined`;
    }

    function strDevpacker() {
        return __devpacker__.toString();
    }

    function strCallbackWrap(source) {
        return `(function __devpacker__wrapper(require, module, exports) {\n${source}\n})`;
    }

    function strCheckMethod($class, method) {
        return `module.exports = require("devpacker-util/fn-get-or-throw").checkMethod(global.${$class}, "${method}");`;
    }

    function strCheckFunction($class) {
        return `module.exports = require("devpacker-util/fn-get-or-throw").checkFunction(global.${$class});`
    }

    function strCheck() {
        return `${checkFunction.toString()}
${checkMethod.toString()}
exports.checkFunction = checkFunction;
exports.checkMethod = checkMethod;`
    }

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
    function resolveModuleDependecy(path_base, deps) {
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
    function objectToArrayModuleImported(babel_imports) {
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
    function reader(filename, callback) {
        return isNode ? nodeReadFile(filename,
            callback): browserReadFile(filename,
            callback);
    }

    /**
     * get root directory
     * @param {string} root_file
     */
    function basename(root_file) {
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
        return config.config.minified ? 
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
                let names = runtime.replace(babelCoreJs,'').split('/');
                let fname = names[0].removeLessAndCapitalize( corejsInstance.indexOf(names[0]) >= 0 || names.length>1);
                source = source.replace(new RegExp(`(?:require\\("${runtime.replace(/\//g, '\\/')}"\\);)`, 'g'), m => {
                    return 'getOrThrow.' + (names.length === 1 ? `checkFunction(global.${fname});` :`checkMethod(global.${fname}, "${names[1].removeLessAndCapitalize()}");`)
                }); 
            } else {
                source = source.replace(runtime, 'devpacker-util/helpers/'+runtime.split('/').pop());
            }
        });
        
        if (!!babelHelpersModules.find(rmt => rmt.includes(babelCoreJs)))  {
            source = 'var getOrThrow = require("devpacker-util/fn-get-or-throw");'+ (config.config.minified?'\n':'') + source;
        }
        
        return source;
    }

    /**
     * convert to format umd
     * @param {object[]} mods
     * @return {string}
     */
    function transformCodeToUMD(mods) {
        if (!config.config.useExternalHelpers) {
            let s;
            if (!config.config.corejs&&babelHelpersModules.length) mods.push({module: 'devpacker-util/fn-get-or-throw', source: strCheck()});
            babelHelpersModules.forEach(function(runtime) {
                if (config.config.corejs && runtime.includes(babelCoreJs)) return;
                if (runtime.includes(babelCoreJs)) {
                    let names = runtime.replace(babelCoreJs, '').split('/');
                    let fname = names[0].removeLessAndCapitalize( corejsInstance.indexOf(names[0]) >= 0 || names.length>1);
                    if (names.length === 1) {
                        s = removeRN(strCheckFunction(fname));
                    } else {
                        s = removeRN(strCheckMethod(fname, names[1].removeLessAndCapitalize()));
                    }
                } else {
                    s = todo[runtime];
                }
                mods.push({module: runtime, source: s});
            });
        }
        
        var params = mods.map(({source, module}) => {
            if (!config.config.corejs) source = replaceBabelModule(source);
            return `["${isNode ? module.replace(installModules.root, '') : module}", ${removeRN(strCallbackWrap(source))}]`;
        });
        
        return (`(${removeRN(strDevpacker())})(this, [${removeRN(params.join(`,${config.getNewLine()}`))}])`);
    }

    /**
     * convert to format commonjs
     * @param {object[]} mods
     * @return {string}
     */
    function transformCodeToCJS(mods) {
        var source = mods[0].source;
        if (!config.config.corejs) {
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
        
        if (config.config.format === 'umd') {
            code = transformCodeToUMD(installModules);
        } else if (config.config.format === 'cjs') {
            code = transformCodeToCJS(installModules);
        } else {
            throw `the out format ${config.config.format} is invalid`;
        }
        
        resetInstallModules();
        
        return code;
    }

    /**
     * load file(s) and transform code  
     * @param {string} filename
     * @return {Promise}
     */
    function loader(filename) {
        if (already_read.indexOf(filename) >=0) return;
        already_read.push(filename);
        return new Promise((resolve) => {
            reader(filename, function(es) {
                const err = es.err;
                const data = es.data;
                if (err) return console.error(err);
                const transform = babel.transform(data, config.getCompileOptions().babel);
                const childs = objectToArrayModuleImported(transform.metadata.modules.imports);
                const solve = {
                    module: filename,
                    source: transform.code,
                    deps: []
                };
                
                _invalid_matchModuleRequire(solve.source);
                if (config.config.format === 'umd') {
                    solve.deps = resolveModuleDependecy(basename(filename), childs);
                }
                
                if (!installModules.root) {
                    installModules.root = isNode ? process.cwd() : basename(filename);
                }
                
                solve.deps = Promise.all(solve.deps);
                solve.deps.then(values => {
                    resolve(solve);
                    return values
                });
            });
        }).then(solve =>{
            if (solve) installModules.push(solve);
        })
    }

    function generator(loader) {
        return loader.then(transformCode);
    }

    const VERSION = '0.2.7';

    exports.VERSION = VERSION;
    exports.basename = basename;
    exports.generator = generator;
    exports.loader = loader;
    exports.objectToArrayModuleImported = objectToArrayModuleImported;
    exports.optionConfig = config;
    exports.reader = reader;
    exports.resolveModuleDependecy = resolveModuleDependecy;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
