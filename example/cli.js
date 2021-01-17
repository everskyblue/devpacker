const {optionConfig, generator, loader} = require("../devpacker/devpacker.bundle");

optionConfig.setConfig({format: 'umd'});

generator(loader('./index.js')).then(code => {
    console.log(code);
});