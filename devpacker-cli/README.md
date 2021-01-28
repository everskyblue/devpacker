# devpacker-cli

code conversion through command lines

use the command to display the list of options

```bash
> devpacker -h
```
### Example

out file

```bash
> devpacker --entry filename.js --output bundle.js --format umd --minified true
```

create configuration file

```bash
> devpacker -cf
```

**devpacker.config.js**

```javascript
//config -> object or array<Object>
module.exports = [{
    entry: "",// dirname or filename
    outDir: "", 
    outFile: "",
    // configuration https://www.npmjs.com/package/devpacker
    options: {
        format: "cjs",
        minified: false
    },
    // avalible when entry is directory
    exclude: /(bundle|node_modules)$/, // exclude when scanning
    /**
     * by default ignores hidden files and directories,
     * use it if you want to include in scan
     */
    include: /[]/ 
}]
```

run bundle

```bash
> devpacker start
```