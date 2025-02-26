# NIFTI-Reader-JS
A JavaScript [NIfTI](http://nifti.nimh.nih.gov/) file format reader.  This reader supports both NIfTI-1 and NIfT1-2 file formats, both compressed (.nii.gz) and uncompressed (.nii).

### Usage
[API](https://github.com/rii-mango/NIFTI-Reader-JS/wiki/API), [drawing to canvas example](https://github.com/rii-mango/NIFTI-Reader-JS/blob/master/tests/canvas.html) and [more](https://github.com/rii-mango/NIFTI-Reader-JS/tree/master/tests)

Using in a HTML `script` tag to emulate older behaviour prior to the esbuild changes in `v0.6.4`:

```html
<script type="module">
    import * as nifti from './nifti-reader.js';
    window.nifti = nifti.default;
    console.log(nifti);
</script>
``` 


```javascript
var data = // an ArrayBuffer
var niftiHeader = null,
    niftiImage = null,
    niftiExt = null;

if (nifti.isCompressed(data)) {
    data = nifti.decompress(data);
}

if (nifti.isNIFTI(data)) {
    niftiHeader = nifti.readHeader(data);
    console.log(niftiHeader.toFormattedString());
    niftiImage = nifti.readImage(niftiHeader, data);
    
    if (nifti.hasExtension(niftiHeader)) {
        niftiExt = nifti.readExtensionData(niftiHeader, data);
    }
}
```

### Install
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

### Testing
```
npm test
```

### Building
See the [release folder](https://github.com/rii-mango/NIFTI-Reader-JS/tree/master/release) for the latest builds or build it yourself using:
```
npm run build
```
This will output nifti-reader.js and nifti-reader-min.js to build/.


Acknowledgments
-----
NIFTI-Reader-JS makes use of the following third-party libraries:
- [fflate](https://github.com/101arrowz/fflate) &mdash; for GZIP inflating

