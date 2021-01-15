const isNode = typeof module === 'object' && typeof module.exports === 'object';

const isExports = typeof exports === 'object';

const isBrowser = typeof window === 'object';

const existsGlobalObject = typeof global === 'object';

function normalizeUpperCase(str) {
    return str.replace(/[A-Z]/g, m => (`-${m.toLowerCase()}`));
}

export {
    isNode,
    isExports,
    isBrowser,
    normalizeUpperCase,
    existsGlobalObject,
};