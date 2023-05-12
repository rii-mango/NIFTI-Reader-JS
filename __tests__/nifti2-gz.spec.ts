import {
  isCompressed,
  readHeader,
  readImage,
  decompress,
  isNIFTI2,
  isNIFTI1,
} from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert, expect } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

const buf = fs.readFileSync("./data/avg152T1_LR_nifti2.nii.gz");
let data = Utils.toArrayBuffer(buf);
let nifti2: NIFTI1 | NIFTI2 | null;
var bytes = null;
var clone = null;

describe("NIFTI-Reader-JS", function () {
  describe("compressed nifti-2 test", function () {
    it("isCompressed() should return true", function () {
      assert.equal(true, isCompressed(data));
    });

    it("should not throw error when decompressing", function (done) {
      assert.doesNotThrow(function () {
        data = decompress(data);
        done();
      });
    });

    it("isNIFTI1() should return false", function () {
      assert.equal(false, isNIFTI1(data));
    });

    it("isNIFTI2() should return true", function () {
      assert.equal(true, isNIFTI2(data));
    });

    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti2 = readHeader(data);
        done();
      });
    });

    it("dims[1] should be 91", function () {
      assert.equal(91, nifti2!.dims[1]);
    });

    it("dims[2] should be 109", function () {
      assert.equal(109, nifti2!.dims[2]);
    });

    it("dims[3] should be 91", function () {
      assert.equal(91, nifti2!.dims[3]);
    });

    it("image data checksum should equal 471047545", function () {
      var imageData = readImage(nifti2!, data);
      var checksum = Utils.crc32(new DataView(imageData));
      assert.equal(checksum, 471047545);
    });

    it("data returned from toArrayBuffer preserves all nifti-2 properties", function () {
      bytes = nifti2!.toArrayBuffer();
      clone = readHeader(bytes);
      let niftiHeaderText = JSON.stringify(nifti2);
      let cloneText = JSON.stringify(clone);
      expect(cloneText).to.equal(niftiHeaderText);
    });
  });
});
