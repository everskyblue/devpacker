const fs = require("fs")
const path = require('path');
const recursiveAssignInmutable = require("./assign");
const command = require("./cmd")(process.argv.slice(2));

const workespace = process.cwd();
const reqfile = path.resolve(workespace, 'node_modules/devpacker/devpacker.bundle');

const {generator, loader, optionConfig} = require(reqfile);

const filec = absPath('devpacker.config.js');

const RGX_KEY_JSON = /["](.*?)["]\:/g;
const VERSION = '1.2.11';

const config = {
    entry: '',
    outFile: '',
    outDir: '',
    options: optionConfig.config,
    exclude: /(node_modules)/,
    include: /[]/
}

const copy = Object.assign({}, config);

const input_options = [
    ['-h', '--help'], 
    ['-cf', '--create-config'],
    ['-m', '--minify'],
    ['-f', '--format'],
    ['-e', '-i', '--entry'],
    ['-o', '--output'],
    ['-v', '--version'],
    ['-s', 'start']
];

command.input(input_options, [
    'show command list',
    'create a configuration file',
    'minified code output',
    'output in umd or cjs format',
    'entry of the file or folder to compile',
    'output given by file or folder name when providing input',
    'version devpacker-cli',
    'start compiling code from config file'
])

command.option(0, command.log)

command.option(1, function () {
    let data = JSON.stringify(config, ((k, v) => v instanceof RegExp ? null : v), 4).replace(RGX_KEY_JSON, '$1:');
    fs.writeFileSync(filec,`module.exports = ${data}`,{encoding: 'utf8'});
    console.log('devpacker.config.js has been created!')
})

command.option(2, setConfig('minified'))
command.option(3, setConfig('format'))
command.option(4, setConfig('entry'))

command.option(5, (vals) => {
    config[path.extname(vals[0]) ? 'outFile' : 'outDir'] = vals[0];
    setTimeout(function() {
        start();
    }, 500);
})

command.option(6, ()=> console.info(`version: ${VERSION}`))

command.option(7, start);

command.run(() => {
    if (process.argv.length === 2) command.log();
});

async function start() {
    let ufg = fs.existsSync(filec) ? require(filec) : config;
    if (!Array.isArray(ufg)) ufg = [ufg];
    console.info(`\ndevpacker-cli@${VERSION}\n`);
    for (const c of ufg) {
        console.time('time');
        recursiveAssignInmutable(config, c, true);
        await generateFile(config);
        // reset config original values
        recursiveAssignInmutable(config, copy, true);
    }
}

function setConfig(key) {
    return function (vals) { config[key] = vals[0]; }
}

async function generateFile(config) {
    const out = config.outFile || config.outDir;
    if (!out || !config.entry) return console.log('wrong configuration, there are empty values') && command.log();
    optionConfig.setConfig(config.options);
    if (path.extname(out) && path.extname(config.entry)) {
        const split = out.split(path.sep);split.pop();
        recursiveDirs(absPath(split.join(path.sep)));
        const code = await generator(loader(absPath(config.entry)));
        fs.writeFileSync(absPath(out), code, {encoding: 'utf8'});
        console.log(`has been created! -> ${out}`)
        console.timeEnd('time')
    } else if (!path.extname(out) && !path.extname(config.entry)) {
        await createFiles(absPath(config.entry), absPath(out));
        console.timeEnd('time');
        console.time('time')
    } else {
        console.error('entry or output not valid')
    }
    return true;
}

async function createFiles(dirbase, outdir) {
    let files = fs.readdirSync(dirbase, {
        encoding: "utf-8",
        withFileTypes: true
    });
    
    if (!files) return console.error('directory not exists');
    
    for (var file of files) {
        const rootAbsolute = path.resolve(dirbase, file.name);
        const baseWk = dirbaseWorkespace(rootAbsolute);
        
        if ((file.name.startsWith('.') && !config.include.test(baseWk))) continue;
        if (config.exclude.test(baseWk)) continue;
        
        if (file.isFile() && ['.js', '.jsx', '.mjs', '.node'].indexOf(path.extname(file.name)) >= 0) {
            recursiveDirs(outdir);
            console.time('compile time')
            let code = await generator(loader(rootAbsolute))
            fs.writeFileSync(path.resolve(outdir, file.name), code, {encoding: 'utf8'});
            console.dir( dirbaseWorkespace(rootAbsolute) + ' -> '+ dirbaseWorkespace(path.resolve(outdir, file.name)) );
            console.timeEnd('compile time')
        } else if (file.isDirectory()) {
            if (getOutDir() !== rootAbsolute) {
                await createFiles(rootAbsolute, path.resolve(outdir, file.name));
            }
        }
    }
    
    return true;
}

function recursiveDirs(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

function absPath(resl) {
    return path.resolve(workespace, resl);
}

function getOutDir() {
    return absPath(config.outDir);
}

function dirbaseWorkespace(path) {
    return path.replace(workespace, '');
}