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
const buf = fs.readFileSync("./data/5D_small.nii");
const data = utilities_1.Utils.toArrayBuffer(buf);
let nifti1;
let imageData = null;
describe("NIFTI-Reader-JS", () => {
    describe("uncompressed 5D nifti-1 test", function () {
        it("isCompressed() should return false", function () {
            chai_1.assert.equal(false, (0, nifti_1.isCompressed)(data));
        });
        it("should not throw error when reading header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti1 = (0, nifti_1.readHeader)(data);
                done();
            });
        });
        it("dims[1] should be 1", function () {
            chai_1.assert.equal(1, nifti1.dims[1]);
        });
        it("dims[2] should be 2", function () {
            chai_1.assert.equal(2, nifti1.dims[2]);
        });
        it("dims[3] should be 3", function () {
            chai_1.assert.equal(3, nifti1.dims[3]);
        });
        it("dims[4] should be 1", function () {
            chai_1.assert.equal(1, nifti1.dims[4]);
        });
        it("dims[5] should be 3", function () {
            chai_1.assert.equal(3, nifti1.dims[5]);
        });
        it("image size should equal 1 * 2 * 3 * 1 * 3", function () {
            imageData = (0, nifti_1.readImage)(nifti1, data);
            chai_1.assert.equal(18, imageData.byteLength);
        });
        it("image data checksum should equal 1033497386", function () {
            var imageData = (0, nifti_1.readImage)(nifti1, data);
            var checksum = utilities_1.Utils.crc32(new DataView(imageData));
            chai_1.assert.equal(checksum, 1168954819);
        });
    });
});
//# sourceMappingURL=nifti1-5D-small.spec.js.map