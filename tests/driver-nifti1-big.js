
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../src/nifti.js');

var buf = fs.readFileSync('./tests/data/big.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;

describe('NIFTI-Reader-JS', function () {
    describe('nifti-1 big endian test', function () {
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

        it('numBitsPerVoxel should be 32', function () {
            assert.equal(32, nifti1.numBitsPerVoxel);
        });

        it('littleEndian should be false', function () {
            assert.equal(false, nifti1.littleEndian);
        });

        it('dims[1] should be 64', function () {
            assert.equal(64, nifti1.dims[1]);
        });

        it('dims[2] should be 64', function () {
            assert.equal(64, nifti1.dims[2]);
        });

        it('dims[3] should be 21', function () {
            assert.equal(21, nifti1.dims[3]);
        });

        it('image data checksum should equal 3243691439', function () {
            var imageData = nifti.readImage(nifti1, data);
            var checksum = nifti.Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 3243691439);
        });
    });
});
