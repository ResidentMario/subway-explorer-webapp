This the web application (front-end) component of the NYC Subway Explorer webapp. 

To generate the distribution from the source, run the following:

```sh
npx browserify -t [ babelify --presets [ env react ] --plugins transform-object-rest-spread ] src/index.js -o dist/index.js
```

The application can then be served by running the following from the root folder:

```sh
npx http-server .
```