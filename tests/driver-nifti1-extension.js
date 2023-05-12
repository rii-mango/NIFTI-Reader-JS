
/*jslint browser: true, node: true */
/*global require, module, describe, it */

"use strict";

var assert = require("assert");
var fs = require('fs');

var nifti = require('../dist/src/nifti.js');

// var buf = fs.readFileSync('./tests/data/afni.nii.gz');
var buf = fs.readFileSync('./data/with_extension.nii.gz');
var data = nifti.Utils.toArrayBuffer(buf);
var nifti1 = null;
var extension = null;
const EXPECTED_EXTENSION_LENGTH = 376;

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

        it('extension length should be 376 (384 - 8)', function () {
            assert.equal(EXPECTED_EXTENSION_LENGTH + 8, nifti1.getExtensionSize(new DataView(data)));
            
            assert.equal(EXPECTED_EXTENSION_LENGTH, nifti.readExtensionData(nifti1, data).byteLength);
        });

        it('should have one extension that is 376 bytes', function() {
            extension = nifti1.extensions[0];
            assert.equal(EXPECTED_EXTENSION_LENGTH, extension.edata.byteLength);
            assert.equal(1, nifti1.extensions.length);
        });

        it('removed extension changes the vox offset', function() {
            extension = nifti1.extensions[0];
            assert.equal(EXPECTED_EXTENSION_LENGTH, extension.edata.byteLength);
            assert.equal(1, nifti1.extensions.length);
        });

        it('removed extension updates the vox offset', function() {            
            let oldVoxOffset = nifti1.vox_offset;
            nifti1.removeExtension(0);
            assert.equal(0, nifti1.extensions.length);
            assert.equal(nifti1.vox_offset + extension.esize, oldVoxOffset); 
        });

        it('added extension updates vox_offset', function() {
            let oldVoxOffset = nifti1.vox_offset;
            nifti1.addExtension(extension);
            assert.equal(1, nifti1.extensions.length);
            assert.equal(nifti1.vox_offset, oldVoxOffset + extension.esize); 
        });

        it('toArrayBuffer properly allocates extension byte array', function() {
            assert.equal(1, nifti1.extensions.length);
            let bytesWithHeader = nifti1.toArrayBuffer(true);
            let bytesWithoutHeader = nifti1.toArrayBuffer();
            let headerBytesGreater = bytesWithHeader.byteLength > bytesWithoutHeader.byteLength;
            
            assert.equal(true, headerBytesGreater);
        });

        it('toArrayBuffer properly preserves extension bytes', function() {
            let bytes = nifti1.toArrayBuffer(true);
            let copy = nifti.readHeader(bytes);
            assert.equal(1, copy.extensions.length);
            assert.equal(EXPECTED_EXTENSION_LENGTH, copy.extensions[0].edata.byteLength);
        });

        it('extensions can be added and serialized', function() {
            let edata = new Int32Array(6);
            edata.fill(8);
            let newExtension = new nifti.NIFTIEXTENSION(32, 4, edata.buffer, true);
            nifti1.addExtension(newExtension);
            assert.equal(2, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = nifti.readHeader(bytes);
            assert.equal(2, copy.extensions.length);
            assert.equal(4, copy.extensions[1].ecode);
            assert.equal(24, copy.extensions[1].edata.byteLength);
        });

        it('extensions can be removed by index', function() {
            nifti1.removeExtension(1);
            assert.equal(1, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = nifti.readHeader(bytes);
            assert.equal(1, copy.extensions.length);
            assert.equal(EXPECTED_EXTENSION_LENGTH, copy.extensions[0].edata.byteLength);
        })

        it('extensions can be inserted and serialized', function() {
            let newExtension = new nifti.NIFTIEXTENSION(32, 4, new Uint8Array(16), true);
            nifti1.addExtension(newExtension, 0);
            assert.equal(2, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = nifti.readHeader(bytes);
            assert.equal(2, copy.extensions.length);
            assert.equal(4, copy.extensions[0].ecode);
            assert.equal(32, copy.extensions[0].esize);
            assert.equal(24, copy.extensions[0].edata.byteLength);
            
        })

    });
});
