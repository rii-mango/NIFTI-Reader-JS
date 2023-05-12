"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nifti_1 = require("../src/nifti");
const chai_1 = require("chai");
const fs = __importStar(require("fs"));
const utilities_1 = require("../src/utilities");
const nifti_2 = require("../src/nifti");
var buf = fs.readFileSync('./data/with_extension.nii.gz');
var data = utilities_1.Utils.toArrayBuffer(buf);
let nifti1 = null;
let extension = null;
const EXPECTED_EXTENSION_LENGTH = 376;
describe('NIFTI-Reader-JS', function () {
    describe('nifti-1 extension test', function () {
        it('should not throw error when decompressing', function (done) {
            chai_1.assert.doesNotThrow(function () {
                data = (0, nifti_1.decompress)(data);
                done();
            });
        });
        it('isNIFTI1() should return true', function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI1)(data));
        });
        it('should not throw error when reading header', function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti1 = (0, nifti_1.readHeader)(data);
                done();
            });
        });
        it('hasExtension() should return true', function () {
            chai_1.assert.equal(true, (0, nifti_1.hasExtension)(nifti1));
        });
        it('extension length should be 376 (384 - 8)', function () {
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH + 8, nifti1.getExtensionSize(new DataView(data)));
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH, (0, nifti_1.readExtensionData)(nifti1, data).byteLength);
        });
        it('should have one extension that is 376 bytes', function () {
            extension = nifti1.extensions[0];
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH, extension.edata.byteLength);
            chai_1.assert.equal(1, nifti1.extensions.length);
        });
        it('removed extension changes the vox offset', function () {
            extension = nifti1.extensions[0];
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH, extension.edata.byteLength);
            chai_1.assert.equal(1, nifti1.extensions.length);
        });
        it('removed extension updates the vox offset', function () {
            let oldVoxOffset = nifti1.vox_offset;
            nifti1.removeExtension(0);
            chai_1.assert.equal(0, nifti1.extensions.length);
            chai_1.assert.equal(nifti1.vox_offset + extension.esize, oldVoxOffset);
        });
        it('added extension updates vox_offset', function () {
            let oldVoxOffset = nifti1.vox_offset;
            nifti1.addExtension(extension);
            chai_1.assert.equal(1, nifti1.extensions.length);
            chai_1.assert.equal(nifti1.vox_offset, oldVoxOffset + extension.esize);
        });
        it('toArrayBuffer properly allocates extension byte array', function () {
            chai_1.assert.equal(1, nifti1.extensions.length);
            let bytesWithHeader = nifti1.toArrayBuffer(true);
            let bytesWithoutHeader = nifti1.toArrayBuffer();
            let headerBytesGreater = bytesWithHeader.byteLength > bytesWithoutHeader.byteLength;
            chai_1.assert.equal(true, headerBytesGreater);
        });
        it('toArrayBuffer properly preserves extension bytes', function () {
            let bytes = nifti1.toArrayBuffer(true);
            let copy = (0, nifti_1.readHeader)(bytes);
            chai_1.assert.equal(1, copy.extensions.length);
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH, copy.extensions[0].edata.byteLength);
        });
        it('extensions can be added and serialized', function () {
            let edata = new Int32Array(6);
            edata.fill(8);
            let newExtension = new nifti_2.NIFTIEXTENSION(32, 4, edata.buffer, true);
            nifti1.addExtension(newExtension);
            chai_1.assert.equal(2, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = (0, nifti_1.readHeader)(bytes);
            chai_1.assert.equal(2, copy.extensions.length);
            chai_1.assert.equal(4, copy.extensions[1].ecode);
            chai_1.assert.equal(24, copy.extensions[1].edata.byteLength);
        });
        it('extensions can be removed by index', function () {
            nifti1.removeExtension(1);
            chai_1.assert.equal(1, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = (0, nifti_1.readHeader)(bytes);
            chai_1.assert.equal(1, copy.extensions.length);
            chai_1.assert.equal(EXPECTED_EXTENSION_LENGTH, copy.extensions[0].edata.byteLength);
        });
        it('extensions can be inserted and serialized', function () {
            let newExtension = new nifti_2.NIFTIEXTENSION(32, 4, new Uint8Array(16), true);
            nifti1.addExtension(newExtension, 0);
            chai_1.assert.equal(2, nifti1.extensions.length);
            let bytes = nifti1.toArrayBuffer(true);
            let copy = (0, nifti_1.readHeader)(bytes);
            chai_1.assert.equal(2, copy.extensions.length);
            chai_1.assert.equal(4, copy.extensions[0].ecode);
            chai_1.assert.equal(32, copy.extensions[0].esize);
            chai_1.assert.equal(24, copy.extensions[0].edata.byteLength);
        });
    });
});
//# sourceMappingURL=nifti1-extension.spec.js.map