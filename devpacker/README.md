# Devpacker

is a Javascript module packer, converting
The code is 2015 in supported code for the browser.
for the code conversation use Babel version 6 and Babel polyfill 6
It can be used through the browser and through command lines.

## Ejemplo

import scripts

```html
<script src="./devpacker/package/babel-6.26.0.js"></script>
<script src="./devpacker/package/babel-polyfill-6.26.0.min.js"></script>
<script src="./devpacker/bundle/devpacker.js"></script>

```

initialize with code conversion

```javascript

devpacker.optionConfig.setConfig({
    /** 
     * (cjs) for commonjs it just converts the current file
     * (umd) packages all modules from main file
    */
    format: 'umd',
    // minified code when converting
    minified: false,
    /**
     * (false) will use the global babelHelpers helpers
     * (true) will use babel-runtime
     */
    useExternalHelpers: false,
    /**
     * specify if you want to use babel-runtime / corejs
     * when false verifies and returns the objects
     * or throw an error
     */
    corejs: false
});

devpacker.generator(devpacker.loader('./example/main.js')).then(function(code) {
    console.log(code);
});

```

to use in command line use

```bash
> npm install -g devpacker-cli
> devpacker -c
```
for more information read devpacker-cli

---
### Nota

desarrolle este pequeño codigo para eliminar muchas instalaciones de modulos que hace babel, para que sea mas facil la conversion de codigo sin depender de otras dependencias.