import { readHeader } from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";
import { NIFTIEXTENSION } from "../src/nifti";

var buf = fs.readFileSync('./data/avg152T1_LR_nifti2.nii.gz');
var data = Utils.toArrayBuffer(buf);
let nifti2: NIFTI1 | NIFTI2 | null = null;
let extension: NIFTIEXTENSION | null = null;
const EXPECTED_EXTENSION_LENGTH = 376;

describe("NIFTI-Reader-JS", function () {
  describe("nifti-2 extension test", function () {
    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti2 = readHeader(data);
        done();
      });
    });

    it("extensions can be added and serialized", function () {
      let edata = new Int32Array(6);
      edata.fill(8);
      let newExtension = new NIFTIEXTENSION(32, 4, edata.buffer, true);
      nifti2!.addExtension(newExtension);
      assert.equal(1, nifti2!.extensions.length);
      let bytes = nifti2!.toArrayBuffer(true);
      let copy = readHeader(bytes);
      assert.equal(1, copy!.extensions.length);
      assert.equal(4, copy!.extensions[0].ecode);
      assert.equal(24, copy!.extensions[0].edata.byteLength);
    });
  });
});