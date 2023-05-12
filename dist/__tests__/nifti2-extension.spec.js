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
var buf = fs.readFileSync('./data/avg152T1_LR_nifti2.nii.gz');
var data = utilities_1.Utils.toArrayBuffer(buf);
let nifti2 = null;
let extension = null;
const EXPECTED_EXTENSION_LENGTH = 376;
describe("NIFTI-Reader-JS", function () {
    describe("nifti-2 extension test", function () {
        it("should not throw error when reading header", function (done) {
            chai_1.assert.doesNotThrow(function () {
                nifti2 = (0, nifti_1.readHeader)(data);
                done();
            });
        });
        it("extensions can be added and serialized", function () {
            let edata = new Int32Array(6);
            edata.fill(8);
            let newExtension = new nifti_2.NIFTIEXTENSION(32, 4, edata.buffer, true);
            nifti2.addExtension(newExtension);
            chai_1.assert.equal(1, nifti2.extensions.length);
            let bytes = nifti2.toArrayBuffer(true);
            let copy = (0, nifti_1.readHeader)(bytes);
            chai_1.assert.equal(1, copy.extensions.length);
            chai_1.assert.equal(4, copy.extensions[0].ecode);
            chai_1.assert.equal(24, copy.extensions[0].edata.byteLength);
        });
    });
});
//# sourceMappingURL=nifti2-extension.spec.js.map