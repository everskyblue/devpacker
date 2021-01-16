# Devpacker

es un empaquetador de módulos Javascript, convirtiendo 
el codigo es2015 en codigo suportado para el navegador.
para la conversación de codigo usa Babel version 6 y babel polyfill 6
se puede usar atravez de navegador y a travez de lineas de comandos.

## Ejemplo

importar scripts

```html
<script src="./devpacker/package/babel-6.26.0.js"></script>
<script src="./devpacker/package/babel-polyfill-6.26.0.min.js"></script>
<script src="./devpacker/devpacker.bundle.js"></script>

```
inicializar con conversion de codigo

```javascript

devpacker.optionConfig.setConfig({
    /** 
     * (cjs) para commonjs solo convierte el archivo actual
     * (umd) empqueta todos los modulos del archivo principal
    */
    format: 'umd',
    // codigo minificado al covertir
    minified: false,
    /**
     * varia el formato dado en:
     * (umd) usara babel helpers de un archivo externo
     * (cjs) si es true usara los helpers de devpacker lo esencial de babel helpers. si es false usara babel runtime helpers
     */
    useExternalHelpers: false,
    /**
     * cuando useExternalHelpers es false y el formart es cjs
     * no se requerira el uso del paquete corejs
     */
    corejs: false
});

devpacker.generator(devpacker.loader('./example/main.js')).then(function(code) {
    console.log(code);
});

```

para usar en linea de comando use
```bash
> npm install -g devpacker-cli
> devpacker -c
```
para mas informacion lea devpacker-cli

---
### Nota

desarrolle este pequeño codigo para eliminar muchas instalaciones de modulos que hace babel, para que sea mas facil la conversion de codigo sin depender de otras dependencias.