/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require("fs");

var nifti = require("../dist/src/nifti.js");

var buf = fs.readFileSync("./data/avg152T1_LR_nifti2.nii.gz");
var data = nifti.Utils.toArrayBuffer(buf);
var nifti2 = null;

describe("NIFTI-Reader-JS", function () {
  describe("nifti-2 extension test", function () {
    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti2 = nifti.readHeader(data);
        done();
      });
    });

    it("extensions can be added and serialized", function () {
      let edata = new Int32Array(6);
      edata.fill(8);
      let newExtension = new nifti.NIFTIEXTENSION(32, 4, edata.buffer, true);
      nifti2.addExtension(newExtension);
      assert.equal(1, nifti2.extensions.length);
      let bytes = nifti2.toArrayBuffer(true);
      let copy = nifti.readHeader(bytes);
      assert.equal(1, copy.extensions.length);
      assert.equal(4, copy.extensions[0].ecode);
      assert.equal(24, copy.extensions[0].edata.byteLength);
    });
  });
});
