'use strict';

var taggedTemplateLiteral = (function (strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
});

module.exports = taggedTemplateLiteral;
