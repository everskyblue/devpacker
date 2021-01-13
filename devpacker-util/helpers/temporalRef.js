'use strict';

var temporalRef = (function (val, name, undef) {
    if (val === undef) {
        throw new ReferenceError(name + " is not defined - temporal dead zone");
    } else {
        return val;
    }
});

module.exports = temporalRef;
