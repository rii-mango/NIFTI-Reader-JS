# NIFTI-Reader-JS
A JavaScript [NIfTI](http://nifti.nimh.nih.gov/) file format reader.  This reader supports both .nii and .nii.gz file types.

###Usage
See the [tests](https://github.com/rii-mango/NIFTI-Reader-JS/tree/master/tests) folder for more examples.

```javascript
var data = // an ArrayBuffer
var niftiHeader = null,
    niftiImage = null;

if (nifti.isCompressed(data)) {
    data = nifti.decompress(data);
}

if (nifti.isNIFTI1(data)) {
    niftiHeader = nifti.readHeader(data);
    niftiImage = nifti.readerImage(niftiHeader, data);
}
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
