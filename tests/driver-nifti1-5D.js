
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../src/nifti.js');

var buf = fs.readFileSync('./tests/data/5D.nii');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;
var imageData = null;

describe('NIFTI-Reader-JS', function () {
    describe('uncompressed nifti-1 test', function () {
        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti1 = nifti.readHeader(data);
                done();
            });
        });

        it('dims[1] should be 256', function () {
            assert.equal(256, nifti1.dims[1]);
        });

        it('dims[2] should be 256', function () {
            assert.equal(256, nifti1.dims[2]);
        });

        it('dims[3] should be 170', function () {
            assert.equal(170, nifti1.dims[3]);
        });

        it('dims[4] should be 1', function () {
            assert.equal(1, nifti1.dims[4]);
        });

        it('dims[5] should be 3', function () {
            assert.equal(3, nifti1.dims[5]);
        });

        it('image size should equal 33423360', function () {
            imageData = nifti.readImage(nifti1, data);
            assert.equal(33423360, imageData.byteLength);
        });
    });
});
