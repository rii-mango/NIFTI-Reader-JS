
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

var buf = fs.readFileSync('./data/not-nifti.nii');
var data = nifti.Utils.toArrayBuffer(buf);

describe('NIFTI-Reader-JS', function () {
    describe('not-nifti test', function () {
        it('isCompressed() should return false', function () {
            assert.equal(false, nifti.isCompressed(data));
        });

        it('isNIFTI() should return false', function () {
            assert.equal(false, nifti.isNIFTI(data));
        });

        it('readHeader() should return null', function () {
            assert.equal(null, nifti.readHeader(data));
        });
    });
});
