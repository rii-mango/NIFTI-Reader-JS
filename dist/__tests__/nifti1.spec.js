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
const buf = fs.readFileSync("./data/avg152T1_LR_nifti.nii");
let data = utilities_1.Utils.toArrayBuffer(buf);
let nifti1;
let bytes = null;
let clone = null;
describe("NIFTI-Reader-JS", function () {
    describe("uncompressed nifti-1 test", function () {
        it("isCompressed() should return false", function () {
            chai_1.assert.equal(false, (0, nifti_1.isCompressed)(data));
        });
        it("isNIFTI1() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI1)(data));
        });
        it("isNIFTI() should return true", function () {
            chai_1.assert.equal(true, (0, nifti_1.isNIFTI)(data));
        });
        it("should not throw error when reading header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti1 = (0, nifti_1.readHeader)(data);
                done();
            });
        });
        it("dims[1] should be 91", function () {
            chai_1.assert.equal(91, nifti1.dims[1]);
        });
        it("dims[2] should be 109", function () {
            chai_1.assert.equal(109, nifti1.dims[2]);
        });
        it("dims[3] should be 91", function () {
            chai_1.assert.equal(91, nifti1.dims[3]);
        });
        it("image data checksum should equal 1033497386", function () {
            var imageData = (0, nifti_1.readImage)(nifti1, data);
            var checksum = utilities_1.Utils.crc32(new DataView(imageData));
            chai_1.assert.equal(checksum, 1033497386);
        });
        it("data returned from toArrayBuffer preserves all nifti-1 properties", function () {
            nifti1 = (0, nifti_1.readHeader)(data);
            bytes = nifti1.toArrayBuffer();
            clone = (0, nifti_1.readHeader)(bytes);
            let niftiHeaderText = JSON.stringify(nifti1);
            let cloneText = JSON.stringify(clone);
            (0, chai_1.expect)(cloneText).to.equal(niftiHeaderText);
        });
        it("description, aux_file, intent_name and magic are preserved", function () {
            bytes = nifti1.toArrayBuffer();
            clone = (0, nifti_1.readHeader)(bytes);
            (0, chai_1.expect)(clone.description).to.equal(nifti1.description);
            (0, chai_1.expect)(clone.aux_file).to.equal(nifti1.aux_file);
            (0, chai_1.expect)(clone.intent_name).to.equal(nifti1.intent_name);
            (0, chai_1.expect)(clone.magic).to.equal(nifti1.magic);
        });
    });
});
//# sourceMappingURL=nifti1.spec.js.map