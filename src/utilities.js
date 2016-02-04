
/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/

var nifti = nifti || {};
nifti.Utils = nifti.Utils || {};


/*** Static Pseudo-constants ***/

nifti.Utils.crcTable = null;
nifti.Utils.GUNZIP_MAGIC_COOKIE1 = 31;
nifti.Utils.GUNZIP_MAGIC_COOKIE2 = 139;


/*** Static methods ***/

nifti.Utils.toArrayBuffer = function (buffer) {
    var ab, view, i;

    ab = new ArrayBuffer(buffer.length);
    view = new Uint8Array(ab);
    for (i = 0; i < buffer.length; i += 1) {
        view[i] = buffer[i];
    }
    return ab;
};


// http://stackoverflow.com/questions/18638900/javascript-crc32
nifti.Utils.makeCRCTable = function(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
};

nifti.Utils.crc32 = function(dataView) {
    var crcTable = nifti.Utils.crcTable || (nifti.Utils.crcTable = nifti.Utils.makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < dataView.byteLength; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};


/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti.Utils;
}
