import { isCompressed, readHeader, readImage } from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

const buf = fs.readFileSync("./data/5D_small.nii");
const data = Utils.toArrayBuffer(buf);
let nifti1: NIFTI1 | NIFTI2 | null;
let imageData = null;

describe("NIFTI-Reader-JS", () => {
  describe("uncompressed 5D nifti-1 test", function () {
    it("isCompressed() should return false", function () {
      assert.equal(false, isCompressed(data));
    });
    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti1 = readHeader(data);
        done();
      });
    });

    it("dims[1] should be 1", function () {
      assert.equal(1, nifti1!.dims[1]);
    });

    it("dims[2] should be 2", function () {
      assert.equal(2, nifti1!.dims[2]);
    });

    it("dims[3] should be 3", function () {
      assert.equal(3, nifti1!.dims[3]);
    });

    it("dims[4] should be 1", function () {
      assert.equal(1, nifti1!.dims[4]);
    });

    it("dims[5] should be 3", function () {
      assert.equal(3, nifti1!.dims[5]);
    });

    it("image size should equal 1 * 2 * 3 * 1 * 3", function () {
      imageData = readImage(nifti1!, data);
      assert.equal(18, imageData.byteLength);
    });

    it("image data checksum should equal 1033497386", function () {
      var imageData = readImage(nifti1!, data);
      var checksum = Utils.crc32(new DataView(imageData));
      assert.equal(checksum, 1168954819);
    });
  });
});
