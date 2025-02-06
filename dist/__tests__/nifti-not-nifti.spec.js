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
const buf = fs.readFileSync("./data/not-nifti.nii");
let data = utilities_1.Utils.toArrayBuffer(buf);
describe('NIFTI-Reader-JS', function () {
    describe('not-nifti test', function () {
        it('isCompressed() should return false', function () {
            chai_1.assert.equal(false, (0, nifti_1.isCompressed)(data));
        });
        it('isNIFTI() should return false', function () {
            chai_1.assert.equal(false, (0, nifti_1.isNIFTI)(data));
        });
        it('readHeader() should return null', function () {
            chai_1.assert.throws(() => (0, nifti_1.readHeader)(data), 'That file does not appear to be NIFTI!');
        });
    });
});
//# sourceMappingURL=nifti-not-nifti.spec.js.map