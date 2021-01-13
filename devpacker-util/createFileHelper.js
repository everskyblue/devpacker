const helpers = require("./babel-helpers");
const fs = require("fs");

for (const name in helpers)  {
    const filename = name[0] === '_' ? name.slice(1) : name;
    if (!fs.existsSync('./_helpers_module')) fs.mkdirSync('./_helpers_module');
    fs.writeFileSync(`./_helpers_module/${filename}.js`, `export {${name} as default} from "../babel-helpers.module"`,{
        encoding:'utf8',
        flag: 'w+'
    })
}