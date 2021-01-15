import devpackerHelpers from "./helpers";

export function strDevpacker() {
    return devpackerHelpers.toString();
}

export function strCallbackWrap(source) {
    return `(function __devpacker__wrapper(require, module, exports) {\n${source}\n})`;
}

export function strCheckMethod($class, method) {
    return `("${method}" in ${$class}) ? function(o) { return ${$class}.prototype.${method}.apply(o, Array.prototype.slice.call(arguments, 1)); } : (function () { throw "${$class}.${method} is not a function"; })();`
}

