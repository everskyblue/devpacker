import devpackerHelpers from "./helpers";
import {checkMethod, checkFunction} from "../devpacker-util/fn/get-or-throw";

export function strDevpacker() {
    return devpackerHelpers.toString();
}

export function strCallbackWrap(source) {
    return `(function __devpacker__wrapper(require, module, exports) {\n${source}\n})`;
}

export function strCheckMethod($class, method) {
    return `module.exports = require("devpacker-util/fn-get-or-throw").checkMethod(global.${$class}, "${method}");`;
}

export function strCheckFunction($class) {
    return `module.exports = require("devpacker-util/fn-get-or-throw").checkFunction(global.${$class});`
}

export function strCheck() {
    return `${checkFunction.toString()}
${checkMethod.toString()}
exports.checkFunction = checkFunction;
exports.checkMethod = checkMethod;`
} 