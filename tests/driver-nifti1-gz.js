
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

var buf = fs.readFileSync('./data/avg152T1_LR_nifti.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;

describe('NIFTI-Reader-JS', function () {
    describe('compressed nifti-1 test', function () {
        it('isCompressed() should return true', function () {
            assert.equal(true, nifti.isCompressed(data));
        });

        it('should not throw error when decompressing', function (done) {
            assert.doesNotThrow(function() {
                data = nifti.decompress(data);
                done();
            });
        });

        it('isNIFTI1() should return true', function () {
            assert.equal(true, nifti.isNIFTI1(data));
        });

        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti1 = nifti.readHeader(data);
                done();
            });
        });

        it('dims[1] should be 91', function () {
            assert.equal(91, nifti1.dims[1]);
        });

        it('dims[2] should be 109', function () {
            assert.equal(109, nifti1.dims[2]);
        });

        it('dims[3] should be 91', function () {
            assert.equal(91, nifti1.dims[3]);
        });

        it('hasExtension() should return false', function () {
            assert.equal(false, nifti.hasExtension(nifti1));
        });

        it('image data checksum should equal 1033497386', function () {
            var imageData = nifti.readImage(nifti1, data);
            var checksum = nifti.Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 1033497386);
        });
    });
});
