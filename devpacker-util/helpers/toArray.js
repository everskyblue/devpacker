'use strict';

var toArray = (function (arr) {
    return Array.isArray(arr) ? arr: Array.from(arr);
});

module.exports = toArray;
