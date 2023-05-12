import {
  isCompressed,
  readHeader,
  readImage,
  isNIFTI1,
  isNIFTI,
} from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert, expect } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

const buf = fs.readFileSync("./data/avg152T1_LR_nifti.nii");
let data = Utils.toArrayBuffer(buf);
let nifti1: NIFTI1 | NIFTI2 | null;
let bytes = null;
let clone = null;

describe("NIFTI-Reader-JS", function () {
  describe("uncompressed nifti-1 test", function () {
    it("isCompressed() should return false", function () {
      assert.equal(false, isCompressed(data));
    });

    it("isNIFTI1() should return true", function () {
      assert.equal(true, isNIFTI1(data));
    });

    it("isNIFTI() should return true", function () {
      assert.equal(true, isNIFTI(data));
    });

    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti1 = readHeader(data);
        done();
      });
    });

    it("dims[1] should be 91", function () {
      assert.equal(91, nifti1!.dims[1]);
    });

    it("dims[2] should be 109", function () {
      assert.equal(109, nifti1!.dims[2]);
    });

    it("dims[3] should be 91", function () {
      assert.equal(91, nifti1!.dims[3]);
    });

    it("image data checksum should equal 1033497386", function () {
      var imageData = readImage(nifti1!, data);
      var checksum = Utils.crc32(new DataView(imageData));
      assert.equal(checksum, 1033497386);
    });

    it("data returned from toArrayBuffer preserves all nifti-1 properties", function () {
      nifti1 = readHeader(data);
      bytes = nifti1!.toArrayBuffer();
      clone = readHeader(bytes);
      let niftiHeaderText = JSON.stringify(nifti1);
      let cloneText = JSON.stringify(clone);
      expect(cloneText).to.equal(niftiHeaderText);
    });
  });
});
