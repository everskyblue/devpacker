import * as babelHelpers from "../devpacker-util/babel-helpers.module"
import { normalizeUpperCase, isBrowser, isNode, existsGlobalObject } from './util'

const todo = {
    'babel-runtime/regenerator': checkVarGlobalRuntimeRegenerator(isNode && existsGlobalObject ? 'global' : isBrowser ? 'window' : 'this')
};

export default todo;

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
