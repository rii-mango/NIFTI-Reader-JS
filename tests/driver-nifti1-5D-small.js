
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

var buf = fs.readFileSync('./data/5D_small.nii');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;
var imageData = null;

describe('NIFTI-Reader-JS', function () {
    describe('uncompressed 5D nifti-1 test', function () {
        it('isCompressed() should return false', function () {
            assert.equal(false, nifti.isCompressed(data));
        });

        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti1 = nifti.readHeader(data);
                done();
            });
        });

        it('dims[1] should be 1', function () {
            assert.equal(1, nifti1.dims[1]);
        });

        it('dims[2] should be 2', function () {
            assert.equal(2, nifti1.dims[2]);
        });

        it('dims[3] should be 3', function () {
            assert.equal(3, nifti1.dims[3]);
        });

        it('dims[4] should be 1', function () {
            assert.equal(1, nifti1.dims[4]);
        });

        it('dims[5] should be 3', function () {
            assert.equal(3, nifti1.dims[5]);
        });

        it('image size should equal 1 * 2 * 3 * 1 * 3', function () {
            imageData = nifti.readImage(nifti1, data);
            assert.equal(18, imageData.byteLength);
        });

        it('image data checksum should equal 1033497386', function () {
            var imageData = nifti.readImage(nifti1, data);
            var checksum = nifti.Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 1168954819);
        });
    });
});
