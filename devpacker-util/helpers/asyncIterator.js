'use strict';

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

module.exports = asyncIterator;
