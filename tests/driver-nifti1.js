
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

var buf = fs.readFileSync('./data/avg152T1_LR_nifti.nii');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;
var bytes = null;
var clone = null;

describe('NIFTI-Reader-JS', function () {
    describe('uncompressed nifti-1 test', function () {
        it('isCompressed() should return false', function () {
            assert.equal(false, nifti.isCompressed(data));
        });

        it('isNIFTI1() should return true', function () {
            assert.equal(true, nifti.isNIFTI1(data));
        });

        it('isNIFTI() should return true', function () {
            assert.equal(true, nifti.isNIFTI(data));
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

        it('image data checksum should equal 1033497386', function () {
            var imageData = nifti.readImage(nifti1, data);
            var checksum = nifti.Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 1033497386);
        });


        it('data returned from toArrayBuffer preserves all nifti-1 properties', function() {
            nifti1 = nifti.readHeader(data);
            bytes = nifti1.toArrayBuffer();
            clone = nifti.readHeader(bytes);
            var nifti1Text = JSON.stringify(nifti1);
            var cloneText = JSON.stringify(clone);
            assert.equal(cloneText, nifti1Text);
        });
    });
});
