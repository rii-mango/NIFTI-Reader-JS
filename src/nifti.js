
/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/

/**
 * nifti
 * @type {*|{}}
 */
var nifti = nifti || {};
nifti.NIFTI1 = nifti.NIFTI1 || ((typeof require !== 'undefined') ? require('./nifti1.js') : null);
nifti.NIFTI2 = nifti.NIFTI2 || ((typeof require !== 'undefined') ? require('./nifti2.js') : null);
nifti.NIFTIEXTENSION = nifti.NIFTIEXTENSION || ((typeof require !== 'undefined') ? require('./nifti-extension.js') : null);
nifti.Utils = nifti.Utils || ((typeof require !== 'undefined') ? require('./utilities.js') : null);

var pako = pako || ((typeof require !== 'undefined') ? require('pako') : null);
var fflate = fflate || ((typeof require !== 'undefined') ? require('fflate') : null);

/*** Static Methods ***/

/**
 * Returns true if this data represents a NIFTI-1 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
nifti.isNIFTI1 = function (data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < nifti.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }

    buf = new DataView(data);

    if (buf)

    mag1 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti.NIFTI1.MAGIC_NUMBER_LOCATION + 2);

    if ((isHdrImgPairOK) && (mag1 === nifti.NIFTI1.MAGIC_NUMBER2[0]) && (mag2 === nifti.NIFTI1.MAGIC_NUMBER2[1]) &&
        (mag3 === nifti.NIFTI1.MAGIC_NUMBER2[2]))
        return true; // hdr/img pair

    return !!((mag1 === nifti.NIFTI1.MAGIC_NUMBER[0]) && (mag2 === nifti.NIFTI1.MAGIC_NUMBER[1]) &&
        (mag3 === nifti.NIFTI1.MAGIC_NUMBER[2]));
};


/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
nifti.isNIFTI2 = function (data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;

    if (data.byteLength < nifti.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }

    buf = new DataView(data);
    mag1 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti.NIFTI2.MAGIC_NUMBER_LOCATION + 2);

    if ((isHdrImgPairOK) && (mag1 === nifti.NIFTI2.MAGIC_NUMBER2[0]) && (mag2 === nifti.NIFTI2.MAGIC_NUMBER2[1]) &&
        (mag3 === nifti.NIFTI2.MAGIC_NUMBER2[2]))
        return true; // hdr/img pair

    return !!((mag1 === nifti.NIFTI2.MAGIC_NUMBER[0]) && (mag2 === nifti.NIFTI2.MAGIC_NUMBER[1]) &&
    (mag3 === nifti.NIFTI2.MAGIC_NUMBER[2]));
};



/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
nifti.isNIFTI = function (data, isHdrImgPairOK = false) {
    return (nifti.isNIFTI1(data, isHdrImgPairOK) || nifti.isNIFTI2(data, isHdrImgPairOK));
};



/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
nifti.isCompressed = function (data) {
    var buf, magicCookie1, magicCookie2;

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



/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
nifti.decompress = function (data) {
    return fflate.decompressSync(new Uint8Array(data)).buffer;
};



/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {nifti.NIFTI1|nifti.NIFTI2|null}
 */
nifti.readHeader = function (data, isHdrImgPairOK = false) {
    var header = null;

    if (nifti.isCompressed(data)) {
        data = nifti.decompress(data);
    }

    if (nifti.isNIFTI1(data, isHdrImgPairOK)) {
        header = new nifti.NIFTI1();
    } else if (nifti.isNIFTI2(data, isHdrImgPairOK)) {
        header = new nifti.NIFTI2();
    }

    if (header) {
        header.readHeader(data);
    } else {
        console.error("That file does not appear to be NIFTI!");
    }

    return header;
};



/**
 * Returns true if this header contains an extension.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @returns {boolean}
 */
nifti.hasExtension = function (header) {
    return (header.extensionFlag[0] != 0);
};



/**
 * Returns the image data.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
nifti.readImage = function (header, data) {
    var imageOffset = header.vox_offset,
        timeDim = 1,
        statDim = 1;

    if (header.dims[4]) {
        timeDim = header.dims[4];
    }

    if (header.dims[5]) {
        statDim = header.dims[5];
    }

    var imageSize = header.dims[1] * header.dims[2] * header.dims[3] * timeDim * statDim * (header.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
};



/**
 * Returns the extension data (including extension header).
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
nifti.readExtension = function (header, data) {
    var loc = header.getExtensionLocation(),
        size = header.extensionSize;

    return data.slice(loc, loc + size);
};



/**
 * Returns the extension data.
 * @param {nifti.NIFTI1|nifti.NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
nifti.readExtensionData = function (header, data) {
    var loc = header.getExtensionLocation(),
        size = header.extensionSize;

    return data.slice(loc + 8, loc + size); // +8 for loc and -8 for esize and ecode
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti;
}
