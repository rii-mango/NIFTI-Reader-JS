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
const buf = fs.readFileSync("./data/air2.hdr.gz");
let data = utilities_1.Utils.toArrayBuffer(buf);
let nifti2;
const ibuf = fs.readFileSync("./data/air2.img.gz");
let idata = utilities_1.Utils.toArrayBuffer(ibuf);
let bytes = null;
let clone = null;
describe("NIFTI-Reader-JS", function () {
    describe("uncompressed nifti-2 hdr/img pair test", function () {
        it("isCompressed() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isCompressed)(idata));
        });
        it("should not throw error when decompressing header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                data = (0, nifti_1.decompress)(data);
                done();
            });
        });
        it("should not throw error when decompressing image", function (done) {
            chai_1.assert.doesNotThrow(function () {
                idata = (0, nifti_1.decompress)(idata);
                done();
            });
        });
        it("isNIFTI2() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI2)(data, true));
        });
        it("isNIFTI() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI)(data, true));
        });
        it("should not throw error when reading header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti2 = (0, nifti_1.readHeader)(data, true);
                done();
            });
        });
        it("dims[1] should be 79", function () {
            chai_1.assert.equal(79, nifti2.dims[1]);
        });
        it("dims[2] should be 67", function () {
            chai_1.assert.equal(67, nifti2.dims[2]);
        });
        it("dims[3] should be 64", function () {
            chai_1.assert.equal(64, nifti2.dims[3]);
        });
        it("image data checksum should equal 692149477", function () {
            var imageData = (0, nifti_1.readImage)(nifti2, idata);
            var checksum = utilities_1.Utils.crc32(new DataView(imageData));
            chai_1.assert.equal(checksum, 692149477);
        });
        it("data returned from toArrayBuffer preserves all nifti-2 properties", function () {
            nifti2 = (0, nifti_1.readHeader)(data, true);
            bytes = nifti2.toArrayBuffer();
            clone = (0, nifti_1.readHeader)(bytes, true);
            let niftiHeaderText = JSON.stringify(nifti2);
            let cloneText = JSON.stringify(clone);
            (0, chai_1.expect)(cloneText).to.equal(niftiHeaderText);
        });
    });
});
//# sourceMappingURL=nifti2-pair.spec.js.map