
/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/

var nifti = nifti || {};
nifti.NIFTI1 = nifti.NIFTI1 || ((typeof require !== 'undefined') ? require('./nifti1.js') : null);
nifti.Utils = nifti.Utils || ((typeof require !== 'undefined') ? require('./utilities.js') : null);

var pako = pako || ((typeof require !== 'undefined') ? require('pako') : null);


/*** Static Methods ***/

nifti.isNIFTI1 = function (filename, data) {
    var buf, mag1, mag2, mag3;

    if (filename && (filename.indexOf(".nii") !== -1)) {
        return true;
    }

    buf = new DataView(data);
    mag1 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 2);

    return !!((mag1 === nifti.NIFTI1.MAGIC_NUMBER[0]) && (mag2 === nifti.NIFTI1.MAGIC_NUMBER[1]) &&
        (mag3 === nifti.NIFTI1.MAGIC_NUMBER[2]));
};



nifti.isCompressed = function (filename, data) {
    var buf, magicCookie1, magicCookie2;

    if (filename && (filename.indexOf(".gz") !== -1)) {
        return true;
    }

    if (data) {
        buf = new DataView(data);

        magicCookie1 = buf.getUint8(0);
        magicCookie2 = buf.getUint8(1);

        if (magicCookie1 === nifti.Utils.GUNZIP_MAGIC_COOKIE1) {
            return true;
        }

        if (magicCookie2 === nifti.Utils.GUNZIP_MAGIC_COOKIE2) {
            return true;
        }
    }

    return false;
};


nifti.decompress = function (data) {
    return pako.inflate(data).buffer;
};



nifti.readHeader = function (data) {
    var nifti1 = new nifti.NIFTI1();
    nifti1.readHeader(data);
    return nifti1;
};



nifti.readImage = function (nifti, data) {
    var imageOffset = nifti.vox_offset;
    var imageSize = nifti.dims[1] * nifti.dims[2] * nifti.dims[3] * nifti.dims[4] * (nifti.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti;
}
