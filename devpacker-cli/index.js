const fs = require("fs")
const path = require('path');
const command = require("./cmd")(process.argv.slice(2));

const workespace = process.cwd();
const reqfile = path.resolve(workespace, 'node_modules/devpacker/devpacker.bundle');

const {generator, loader, optionConfig} = require(reqfile);

const filec = absPath('devpacker.config.js');

const config = {
    entry: '',
    outFile: '',
    outDir: '',
    options: optionConfig.config
}

const input_options = [
    ['-h', '--help'],
    ['-cf', '--create-config'],
    ['-m', '--minify'],
    ['-f', '--format'],
    ['-e', '-i', '--entry'],
    ['-o', '--output'],
];

console.time('time');

command.input(input_options, [
    'show command list',
    'create a configuration file',
    'minified code output',
    'output in umd or cjs format',
    'entry of the file or folder to compile',
    'output given by file or folder name when providing input'
])

command.option(0, command.log)

command.option(1, function () {
    let data = JSON.stringify(config, null, 4);
    fs.writeFileSync(filec,`module.exports = ${data}`,{encoding: 'utf8'});
    console.log('devpacker.config.js has been created!')
})

command.option(2, setConfig('minified'))
command.option(3, setConfig('format'))
command.option(4, setConfig('entry'))

command.option(5, (vals) => {
    config[path.extname(vals[0]) ? 'outFile' : 'outDir'] = vals[0];
})

command.run(function () {
    const ufg = fs.existsSync(filec) ? require(filec) : config;
    if (ufg.entry.trim() && (ufg.outDir || ufg.outFile).trim()) {
        generateFile(ufg)
    } else if (process.argv.length === 2) {
        command.log();
    }
});

function setConfig(key) {
    return function (vals) { config[key] = vals[0]; }
}

function generateFile(config) {
    const out = config.outFile || config.outDir;
    if (!out) return;
    optionConfig.setConfig(config.options);
    if (path.extname(out) && path.extname(config.entry)) {
        const split = out.split(path.sep);split.pop();
        recursiveDirs(absPath(split.join(path.sep)));
        generator(loader(absPath(config.entry))).then(data => {
            fs.writeFileSync(absPath(out), data, {encoding: 'utf8'});
            console.log(`has been created! -> ${out}`)
            console.timeEnd('time')
        });
    } else if (!path.extname(out) && !path.extname(config.entry)) {
        createFiles(absPath(config.entry), absPath(out));
        console.timeEnd('time');
    } else {
        console.error('entry or output not valid')
    }
}

function createFiles(dirbase, outdir) {
    recursiveDirs(outdir);
    fs.readdir(dirbase, {
        encoding: "utf-8",
        withFileTypes: true
    }, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (file.isFile() && ['.js', '.node', '.cjs'].indexOf(path.extname(file.name)) >= 0) {
                generator(loader(path.resolve(dirbase, file.name))).then(code => {
                    fs.writeFileSync(path.resolve(outdir, file.name), code, {encoding: 'utf8'});
                    console.dir(path.resolve(outdir, file.name));
                    console.log('has been created!\n')
                })
            } else if (file.isDirectory() && file.name !== '.git') {
                createFiles(path.resolve(dirbase, file.name), path.resolve(outdir, file.name));
            }
        });
    });
}

function recursiveDirs(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

function absPath(resl) {
    return path.resolve(workespace, resl);
}