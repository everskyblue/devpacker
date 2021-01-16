const fs = require("fs");

let minified = false;
let workespace = addSlash(process.cwd());

function addSlash(path) {
    if (path.slice(path.length - 1) !== '/') {
        path += '/';
    }
    return path;
}

function absPath(path) {
    return (workespace + (path[0] === '/' ? path.slice(1) : path));
}

function resolve(base, root) {
    return addSlash(base) + root;
}

function iteratorFiles(root) {
    const files = fs.readdirSync(root);
    const arr = [];
    files.forEach((file, i) => {
        const stat = fs.lstatSync(resolve(root, file));
        if (stat.isDirectory()) {
            arr.push({dir: resolve(root, file), childs: iteratorFiles(resolve(root, file))});
        } else {
            arr.push({file: resolve(root, file), source: fs.readFileSync(resolve(root, file), {encoding: 'utf8'})});
        }
    });
    return arr;
}

exports.set_minified = function set_minified(is) {
    minified = is;
}

exports.entry = function entry(file) {
    const stat = fs.lstatSync(absPath(file));
    if (stat.isDirectory()) {
        const iterator_files = iteratorFiles(absPath(file));
        return (iterator_files);
    } else if (stat.isFile()) {
        
    } else {
        throw "error entry file";
    }
}