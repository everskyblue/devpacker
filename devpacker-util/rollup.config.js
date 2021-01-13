require("./createFileHelper");

const fs = require('fs');
const dirh = './_helpers_module/';
const config = [];

fs.readdirSync(dirh).forEach(file => {
    config.push({
    input: (dirh+file),
    output: {
        dir: 'helpers',
        format: 'cjs'
    }});
});

export default config