'use strict';

// invoke
var _typeof = function () {
    return (typeof Symbol === "function" && typeof Symbol.iterator === "symbol")
    ? function (obj) {
        return typeof obj;
    }
    : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
        ? "symbol": typeof obj;
    };
};

module.exports = _typeof();
