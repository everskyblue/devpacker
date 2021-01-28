const isNode = typeof module === 'object' && typeof module.exports === 'object';

const isExports = typeof exports === 'object';

const isBrowser = typeof window === 'object';

const existsGlobalObject = typeof global === 'object';

String.prototype.removeLessAndCapitalize = function(frombeginning) {
    let nw = this;
    if (frombeginning===true) {
        nw = this[0].toUpperCase() + this.slice(1);
    }
    return nw.replace(/-[a-z]/g, m => m.slice(1).toUpperCase())
}

function normalizeUpperCase(str) {
    str = str.replace(/[A-Z]/g, m => (`-${m.toLowerCase()}`));
    if (str.charAt(0) === '-') {
        str = str.slice(1);
    }
    return str;
}

function normalizeObject(str) {
    return str.slice(1).split('-').map(nstr => nstr)
}

export {
    isNode,
    isExports,
    isBrowser,
    normalizeUpperCase,
    existsGlobalObject,
};