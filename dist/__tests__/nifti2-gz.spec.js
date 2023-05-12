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
const buf = fs.readFileSync("./data/avg152T1_LR_nifti2.nii.gz");
let data = utilities_1.Utils.toArrayBuffer(buf);
let nifti2;
var bytes = null;
var clone = null;
describe("NIFTI-Reader-JS", function () {
    describe("compressed nifti-2 test", function () {
        it("isCompressed() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isCompressed)(data));
        });
        it("should not throw error when decompressing", function (done) {
            chai_1.assert.doesNotThrow(function () {
                data = (0, nifti_1.decompress)(data);
                done();
            });
        });
        it("isNIFTI1() should return false", function () {
            chai_1.assert.equal(false, (0, nifti_1.isNIFTI1)(data));
        });
        it("isNIFTI2() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI2)(data));
        });
        it("should not throw error when reading header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti2 = (0, nifti_1.readHeader)(data);
                done();
            });
        });
        it("dims[1] should be 91", function () {
            chai_1.assert.equal(91, nifti2.dims[1]);
        });
        it("dims[2] should be 109", function () {
            chai_1.assert.equal(109, nifti2.dims[2]);
        });
        it("dims[3] should be 91", function () {
            chai_1.assert.equal(91, nifti2.dims[3]);
        });
        it("image data checksum should equal 471047545", function () {
            var imageData = (0, nifti_1.readImage)(nifti2, data);
            var checksum = utilities_1.Utils.crc32(new DataView(imageData));
            chai_1.assert.equal(checksum, 471047545);
        });
        it("data returned from toArrayBuffer preserves all nifti-2 properties", function () {
            bytes = nifti2.toArrayBuffer();
            clone = (0, nifti_1.readHeader)(bytes);
            let niftiHeaderText = JSON.stringify(nifti2);
            let cloneText = JSON.stringify(clone);
            (0, chai_1.expect)(cloneText).to.equal(niftiHeaderText);
        });
    });
});
//# sourceMappingURL=nifti2-gz.spec.js.map