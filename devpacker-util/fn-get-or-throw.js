'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.checkFunction = checkFunction;
exports.checkMethod = checkMethod;
