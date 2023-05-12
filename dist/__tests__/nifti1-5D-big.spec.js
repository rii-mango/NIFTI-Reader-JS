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
const buf = fs.readFileSync("./data/big.nii.gz");
let data = utilities_1.Utils.toArrayBuffer(buf);
let nifti1;
describe('NIFTI-Reader-JS', function () {
    describe('nifti-1 big endian test', function () {
        it('isCompressed() should return true', function () {
            chai_1.assert.equal(true, (0, nifti_1.isCompressed)(data));
        });
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
        it('numBitsPerVoxel should be 32', function () {
            chai_1.assert.equal(32, nifti1.numBitsPerVoxel);
        });
        it('littleEndian should be false', function () {
            chai_1.assert.equal(false, nifti1.littleEndian);
        });
        it('dims[1] should be 64', function () {
            chai_1.assert.equal(64, nifti1.dims[1]);
        });
        it('dims[2] should be 64', function () {
            chai_1.assert.equal(64, nifti1.dims[2]);
        });
        it('dims[3] should be 21', function () {
            chai_1.assert.equal(21, nifti1.dims[3]);
        });
        it('image data checksum should equal 3243691439', function () {
            var imageData = (0, nifti_1.readImage)(nifti1, data);
            var checksum = utilities_1.Utils.crc32(new DataView(imageData));
            chai_1.assert.equal(checksum, 3243691439);
        });
    });
});
//# sourceMappingURL=nifti1-5D-big.spec.js.map