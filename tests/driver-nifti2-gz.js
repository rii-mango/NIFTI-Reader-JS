
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

var buf = fs.readFileSync('./data/avg152T1_LR_nifti2.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti2 = null;
var bytes = null;
var clone = null;

describe('NIFTI-Reader-JS', function () {
    describe('compressed nifti-2 test', function () {
        it('isCompressed() should return true', function () {
            assert.equal(true, nifti.isCompressed(data));
        });

        it('should not throw error when decompressing', function (done) {
            assert.doesNotThrow(function() {
                data = nifti.decompress(data);
                done();
            });
        });

        it('isNIFTI1() should return false', function () {
            assert.equal(false, nifti.isNIFTI1(data));
        });

        it('isNIFTI2() should return true', function () {
            assert.equal(true, nifti.isNIFTI2(data));
        });

        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti2 = nifti.readHeader(data);
                done();
            });
        });

        it('dims[1] should be 91', function () {
            assert.equal(91, nifti2.dims[1]);
        });

        it('dims[2] should be 109', function () {
            assert.equal(109, nifti2.dims[2]);
        });

        it('dims[3] should be 91', function () {
            assert.equal(91, nifti2.dims[3]);
        });

        it('image data checksum should equal 471047545', function () {
            var imageData = nifti.readImage(nifti2, data);
            var checksum = nifti.Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 471047545);
        });

        it('data returned from toArrayBuffer preserves all nifti-2 properties', function() {
            bytes = nifti2.toArrayBuffer();
            clone = nifti.readHeader(bytes);
            var nifti2Text = JSON.stringify(nifti2);
            var cloneText = JSON.stringify(clone);
            assert.equal(cloneText, nifti2Text);
        });

    });
});
