// https://gist.github.com/everskyblue/5c8b583f4d3ee1a0756dfaf7cb879bf7

const type = (t) => typeof t;
const isTypeEqual = (t, a) => (typeof t === typeof a);
const isObject = (t, a) => (type(t) === 'object' && type(a) === 'object' && t.toString() === '[object Object]' && a.toString() === '[object Object]');

module.exports = function recursiveAssignInmutable(target, assgn, isAddTarget){
    const imutables = isAddTarget ? target : Object.assign({}, target);
    if (typeof target === 'object' && typeof assgn === 'object') {
        var descriptor_target = Object.getOwnPropertyDescriptors(target);
        for (var key in descriptor_target) {
            if ( isObject(descriptor_target[key].value, assgn[key]) && descriptor_target[key].writable) {
                 imutables[key] = recursiveAssignInmutable(target[key], assgn[key], isAddTarget);
            } else  if (isTypeEqual(descriptor_target[key].value, assgn[key]) && descriptor_target[key].writable){
                imutables[key] = assgn[key];
            }
        }
        return imutables;
    }
    throw "is not object";
}
