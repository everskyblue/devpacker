import devpackerHelpers from "./helpers";
import {checkMethod, checkFunction} from "../devpacker-util/fn/get-or-throw";

export function strDevpacker() {
    return devpackerHelpers.toString();
}

export function strCallbackWrap(source, newLine) {
    return `(function __devpacker__wrapper(require, module, exports) {${newLine + source + newLine}})`;
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