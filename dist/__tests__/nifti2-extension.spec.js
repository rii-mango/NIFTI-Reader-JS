import { readHeader } from "../src/nifti.js";
import * as fs from "fs";
import { Utils } from "../src/utilities.js";
import { NIFTIEXTENSION } from "../src/nifti.js";
import { describe, it, assert } from "vitest";
var buf = fs.readFileSync("./data/avg152T1_LR_nifti2.nii.gz");
var data = Utils.toArrayBuffer(buf);
let nifti2 = null;
let extension = null;
const EXPECTED_EXTENSION_LENGTH = 376;
describe("NIFTI-Reader-JS", function () {
    describe("nifti-2 extension test", function () {
        it("should not throw error when reading header", function (done) {
            assert.doesNotThrow(function () {
                nifti2 = readHeader(data);
            });
        });
        it("extensions can be added and serialized", function () {
            let edata = new Int32Array(6);
            edata.fill(8);
            let newExtension = new NIFTIEXTENSION(32, 4, edata.buffer, true);
            nifti2.addExtension(newExtension);
            assert.equal(1, nifti2.extensions.length);
            let bytes = nifti2.toArrayBuffer(true);
            let copy = readHeader(bytes);
            assert.equal(1, copy.extensions.length);
            assert.equal(4, copy.extensions[0].ecode);
            assert.equal(24, copy.extensions[0].edata.byteLength);
        });
    });
});
//# sourceMappingURL=nifti2-extension.spec.js.map