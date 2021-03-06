/**
 * devpacker
 */
export default function __devpacker__($global, arr_modules) {
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
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(_exports))
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
                if (startsWith && !root.endsWith('.js')) (root += '.js')
                if (root in modules) {
                    if (this.children.indexOf(root) < 0) {
                        this.children.push(root);
                    }
                    return modules[root]();
                } else if (isNode) {
                    return require(modulepath);
                }
                throw new ReferenceError('module '+ root +' not exists');
            }
        }

        function __devpacker_wrap_invoke(module_wrap) {
            module_wrap(this.require.bind(this), this.module, this.module.exports);
            return this.module.exports;
        }

        var module = new __Devpacker__Module(moduleId);
        modules[moduleId] = __devpacker_wrap_invoke.bind(module, wrapper);
    }
}