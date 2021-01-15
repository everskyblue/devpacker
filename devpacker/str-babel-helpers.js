import * as babelHelpers from "../devpacker-util/babel-helpers.module"
import {strCheckMethod} from "./str-helpers"
import { normalizeUpperCase, isBrowser, isNode, existsGlobalObject } from './util'

const todo = {
    'babel-runtime/regenerator': checkVarGlobalRuntimeRegenerator(isNode && existsGlobalObject ? 'global' : isBrowser ? 'window' : 'this')
};

export default todo;

const babelBaseHelper = 'babel-runtime/helpers/';
const babelBaseCoreJsHelper = babelBaseHelper + 'core-js/';

/**
 * @type {string[]}
 */
const arrayMethods = [
    "concat",
    "find",
    "findIndex",
    "pop",
    "push",
    "shift",
    "unshift",
    "slice",
    "splice",
    "includes",
    "indexOf",
    "keys",
    "entries",
    "forEach",
    "filter",
    "map",
    "every",
    "some",
    "reduce",
    "reduceRight",
    "toString",
    "toLocaleString",
    "join",
    "reverse",
    "sort",
    "lastIndexOf",
    "copyWithin",
    "fill",
    "values",
    "flat",
    "flatMap"
];

/**
 * @type {string[]}
 */
const objectMethods = [
    "assign",
    "getOwnPropertyDescriptor",
    "getOwnPropertyDescriptors",
    "getOwnPropertyNames",
    "getOwnPropertySymbols",
    "is",
    "preventExtensions",
    "seal",
    "create",
    "defineProperties",
    "defineProperty",
    "freeze",
    "getPrototypeOf",
    "setPrototypeOf",
    "isExtensible",
    "isFrozen",
    "isSealed",
    "keys",
    "entries",
    "values",
    "fromEntries"
];

/**
 * no se encuentra en los helpers
 * ["MAX_VALUE","MIN_VALUE","NaN","NEGATIVE_INFINITY","POSITIVE_INFINITY"]
 * @type {string[]}
 */
const numberMethods = [
    "isFinite",
    "isInteger",
    "isNaN",
    "isSafeInteger",
    "parseFloat",
    "parseInt",
    "MAX_SAFE_INTEGER",
    "MIN_SAFE_INTEGER",
    "EPSILON"
]

/**
 * helpers not included
 * [
    "abs",
    "asin",
    "atan",
    "atan2",
    "ceil",
    "cos",
    "cosh",
    "exp",
    "floor",
    "log",
    "max",
    "min",
    "pow",
    "random",
    "round",
    "sin",
    "sqrt",
    "tan",
    "E",
    "LN10",
    "LN2",
    "LOG10E",
    "LOG2E",
    "PI",
    "SQRT1_2",
    "SQRT2"
 * ]
 * 
 * @type {string[]}
 */
const mathMethods = [
    "log1p",//
    "log2",//
    "log10",//
    "acosh",//
    "asinh",//
    "sign",//
    "tanh",//
    "trunc",//
    "atanh",//
    "sinh",//
    "imul",//
    "clz32",//
    "cbrt",//
    "acos",//
    "expm1",//
    "fround",//
    "hypot",//
    "iaddh",
    "imulh",
    "isubh",
    "umulh"
]

const reflectMethods = [
    "defineProperty",
    "deleteProperty",
    "apply",
    "construct",
    "get",
    "getOwnPropertyDescriptor",
    "getPrototypeOf",
    "has",
    "isExtensible",
    "ownKeys",
    "preventExtensions",
    "set",
    "setPrototypeOf"
]

/**
 * @type {string[]}
 */
const jsonMethods = ['stringify'];

/**
 * @type {string[]}
 */
const regexpMethods = ['escape'];

/**
 * @type {string[]}
 */
const systemMethods = ['global'];

/**
 * @type {string[]}
 */
const symbolMethods = [];

/**
 * @type {string[]}
 */
const stringMethods = [];

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

addSupportMethods('Array', arrayMethods, babelBaseCoreJsHelper + 'array/')
addSupportMethods('JSON', jsonMethods, babelBaseCoreJsHelper + 'json/')
addSupportMethods('Math', mathMethods, babelBaseCoreJsHelper + 'math/')
addSupportMethods('Number', numberMethods, babelBaseCoreJsHelper + 'number/')
addSupportMethods('Object', objectMethods, babelBaseCoreJsHelper + 'object/')
addSupportMethods('Reflect', reflectMethods, babelBaseCoreJsHelper + 'reflect/')
addSupportMethods('RegExp', regexpMethods, babelBaseCoreJsHelper + 'regexp/')
addSupportMethods('String', stringMethods, babelBaseCoreJsHelper + 'string/')
addSupportMethods('Symbol', symbolMethods, babelBaseCoreJsHelper + 'symbol/')
addSupportMethods('system', systemMethods, babelBaseCoreJsHelper + 'system/')

function $exports(key, invk) {
    return 'module.exports = '+ babelHelpers[key] + (invk?'();':'');
}

function checkVarGlobalRuntimeRegenerator($var) {
    return `if (typeof ${$var}.regeneratorRuntime === 'object') return (module.exports = ${$var}.regeneratorRuntime);
    throw "the var regeneratorRuntime is not defined, add babel-polyfill 6.26.0";`;
}
/**
 * @param {string} $class
 * @param {string[]} methods
 * @param {string} path
 */
export function addSupportMethods($class, methods, path) {
    methods.forEach(method => {
        todo[path + normalizeUpperCase(method)] = strCheckMethod($class, method);
    });
}