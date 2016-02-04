# NIFTI-Reader-JS
A JavaScript NIfTI file format reader.

###Usage
See the [tests](https://github.com/rii-mango/NIFTI-Reader-JS/tree/master/tests) folder for more examples.

```javascript
if (nifti.isCompressed(data)) {
    data = nifti.decompress(data);
}

var nifti1 = nifti.readHeader(data);
var imageData = nifti.readerImage(nifti1, data);
```

###Install
Get a packaged source file:

* [nifti-reader.js](https://raw.githubusercontent.com/rii-mango/NIFTI-Reader-JS/master/release/current/nifti-reader.js)
* [nifti-reader-min.js](https://raw.githubusercontent.com/rii-mango/NIFTI-Reader-JS/master/release/current/nifti-reader-min.js)

Or install via [NPM](https://www.npmjs.com/):

```
npm install nifti-reader-js
```

Or install via [Bower](http://bower.io/):

```
bower install nifti-reader-js
```

###Testing
```
npm test
```

###Building
See the [release folder](https://github.com/rii-mango/NIFTI-Reader-JS/tree/master/release) for the latest builds or build it yourself using:
```
npm run build
```
This will output nifti-reader.js and nifti-reader-min.js to build/.
