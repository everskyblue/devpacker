'use strict';

var objectDestructuringEmpty = (function (obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
});

module.exports = objectDestructuringEmpty;
