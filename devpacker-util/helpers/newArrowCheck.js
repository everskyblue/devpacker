'use strict';

var newArrowCheck = (function (innerThis, boundThis) {
    if (innerThis !== boundThis) {
        throw new TypeError("Cannot instantiate an arrow function");
    }
});

module.exports = newArrowCheck;
