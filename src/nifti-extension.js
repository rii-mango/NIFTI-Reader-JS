/*jslint browser: true, node: true */
/*global require, module */

"use strict";

/*** Imports ***/

var nifti = nifti || {};

/*** Constructor ***/

/**
 * The NIFTIEXTENSION constructor.
 * @constructor
 * @property {number} esize - number of bytes that form the extended header data
 * @property {number} ecode - developer group id
 * @property {ArrayBuffer} data - extension data
 * @property {boolean} littleEndian - is little endian
 * @type {Function}
 */ 
nifti.NIFTIEXTENSION = nifti.NIFTIEXTENSION || function (esize, ecode, edata, littleEndian) {
  if(esize % 16 != 0) {
    throw new Error("This does not appear to be a NIFTI extension");
  }
  this.esize = esize;
  this.ecode = ecode;
  this.edata = edata; 
  this.littleEndian = littleEndian;
};

/**
 * Returns extension as ArrayBuffer.
 * @returns {ArrayBuffer}
 */
nifti.NIFTIEXTENSION.prototype.toArrayBuffer = function() {
  let byteArray = new Uint8Array(this.esize);
  byteArray.set(this.data.buffer, 8);
  let view = new DataView(byteArray.buffer);
  
  // size of extension
  view.setInt32(0, this.esize, this.littleEndian);
  view.setInt32(4, this.ecode, this.littleEndian);

  return byteArray.buffer;
};

/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti.NIFTIEXTENSION;
}

