import {
  isCompressed,
  readHeader,
  readImage,
  decompress,
  isNIFTI,
  isNIFTI2,
} from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert, expect } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

const buf = fs.readFileSync("./data/air2.hdr.gz");
let data = Utils.toArrayBuffer(buf);
let nifti2: NIFTI1 | NIFTI2 | null;
const ibuf = fs.readFileSync("./data/air2.img.gz");
let idata = Utils.toArrayBuffer(ibuf);

let bytes = null;
let clone = null;

describe("NIFTI-Reader-JS", function () {
  describe("uncompressed nifti-2 hdr/img pair test", function () {
    it("isCompressed() should return true", function () {
      assert.equal(true, isCompressed(idata));
    });

    it("should not throw error when decompressing header", function (done) {
      assert.doesNotThrow(function () {
        data = decompress(data);
        done();
      });
    });

    it("should not throw error when decompressing image", function (done) {
      assert.doesNotThrow(function () {
        idata = decompress(idata);
        done();
      });
    });

    it("isNIFTI2() should return true", function () {
      assert.equal(true, isNIFTI2(data, true));
    });

    it("isNIFTI() should return true", function () {
      assert.equal(true, isNIFTI(data, true));
    });

    it("should not throw error when reading header", function (done) {
      assert.doesNotThrow(function () {
        nifti2 = readHeader(data, true);
        done();
      });
    });

    it("dims[1] should be 79", function () {
      assert.equal(79, nifti2!.dims[1]);
    });

    it("dims[2] should be 67", function () {
      assert.equal(67, nifti2!.dims[2]);
    });

    it("dims[3] should be 64", function () {
      assert.equal(64, nifti2!.dims[3]);
    });

    it("image data checksum should equal 692149477", function () {
      var imageData = readImage(nifti2!, idata);
      var checksum = Utils.crc32(new DataView(imageData));
      assert.equal(checksum, 692149477);
    });

    it("data returned from toArrayBuffer preserves all nifti-2 properties", function () {
      nifti2 = readHeader(data, true);
      bytes = nifti2!.toArrayBuffer();
      clone = readHeader(bytes, true);
      let niftiHeaderText = JSON.stringify(nifti2);
      let cloneText = JSON.stringify(clone);
      expect(cloneText).to.equal(niftiHeaderText);
    });
  });
});
