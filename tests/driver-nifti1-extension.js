
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../src/nifti.js');

var buf = fs.readFileSync('./tests/data/with_extension.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;

describe('NIFTI-Reader-JS', function () {
    describe('nifti-1 extension test', function () {
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

        it('hasExtension() should return true', function () {
            assert.equal(true, nifti.hasExtension(nifti1));
        });

        it('extension length should be 368', function () {
            assert.equal(368, nifti.readExtensionData(nifti1, data).byteLength);
        });
    });
});
