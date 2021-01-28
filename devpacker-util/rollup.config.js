require("./createFileHelper");

const fs = require('fs');
const path = require("path");
const dirh = './_helpers_module/';
const config = [];

fs.readdirSync(dirh).forEach(file => {
    config.push({
    input: path.resolve(dirh, file),
    output: {
        dir: 'helpers',
        format: 'cjs'
    }});
});

export default config