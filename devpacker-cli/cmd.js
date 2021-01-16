
const out = {
    entries: null,
    outDir: null,
    outFile: null,
    minified: false
}

command.register = {};
command.include = (key) => (args.indexOf(key) >= 0);

function command(option, vals, execute) {
    const filter = args.indexOf(option);
    if (filter >= 0) {
        const len_args = Array.isArray(vals) ? vals.length: typeof vals === 'number' ? vals: (function() {
            throw "specify number of option or values";
        }());

        let options = args.slice(filter+1);
        if (options.length > 1) {
            options = options.slice(0, len_args);
        }
        if (typeof len_args === 'number' && !Array.isArray(vals)) {
            execute(true, len_args === 1 ? options[0]: options);
        } else if (Array.isArray(vals)) {
            var option_vals = options.filter(val => {
                return vals.indexOf(val) >= 0;
            });
            execute(!!option_vals.length, len_args === 1 ? option_vals[0]: option_vals);
        } else {
            console.error('not fount command '+options);
        }
    }
}

command('--minified', ['false', 'true'], (pass, val) => {
    if (!pass) return console.error("value not valid -> [true | false] minified file");
    babelOptions.minified = (val === 'true');
})

command('--entry', 1, (pass, file) => {
    if (!pass) return console.error("proporciona una entrada");
    const sources = entry(file);
    const isfile = command.include('--file');
    if (command.include('--out-dir') || isfile) {
        if (out.outDir) {
            
        } else if (out.outFile) {
            
        } else {
            out.entries = sources;
        }
    } else {
        throw "proporcione una salida con --out-dir [name-dir] o --file [name-file]";
    }
})


command('--out-dir', 1, (pass, dir) => {
    if (!pass) return console.error("proporciona una entrada");

    if (out.entries) {
        createStructDirs(dir);
    } else {
        out.outDir = dir;
    }
})

command('--file', 1, (pass, filename) => {
    if (!pass) return console.error("proporcione el nombre del archivo");

    if (out.entries) {
        createBundleFile(filename);
    } else {
        out.outFile = filename;
    }
})

function createBundleFile(file) {}

function createStructDirs(dirname) {
    console.log(babel.transform(out.entries[0].source, babelOptions).code)
}