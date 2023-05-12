import { isCompressed, readHeader, readImage, decompress } from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import { assert } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

const buf = fs.readFileSync("./data/5D_zeros.nii.gz");
let data = Utils.toArrayBuffer(buf);
let nifti1: NIFTI1 | NIFTI2 | null;
let imageData = null;

describe('NIFTI-Reader-JS', function () {
  describe('compressed 5D nifti-1 test', function () {
      it('isCompressed() should return true', function () {
          assert.equal(true, isCompressed(data));
      });

      it('should not throw error when decompressing', function (done) {
          assert.doesNotThrow(function() {
              data = decompress(data);
              done();
          });
      });
      
      it('should not throw error when reading header', function (done) {
          assert.doesNotThrow(function() {
              nifti1 = readHeader(data);
              done();
          });
      });

      it('dims[1] should be 256', function () {
          assert.equal(256, nifti1!.dims[1]);
      });

      it('dims[2] should be 256', function () {
          assert.equal(256, nifti1!.dims[2]);
      });

      it('dims[3] should be 170', function () {
          assert.equal(170, nifti1!.dims[3]);
      });

      it('dims[4] should be 1', function () {
          assert.equal(1, nifti1!.dims[4]);
      });

      it('dims[5] should be 3', function () {
          assert.equal(3, nifti1!.dims[5]);
      });

      it('image size should equal 33423360', function () {
          imageData = readImage(nifti1!, data);
          assert.equal(33423360, imageData.byteLength);
      });

      it('image data checksum should equal 1033497386', function () {
          var imageData = readImage(nifti1!, data);
          var checksum = Utils.crc32(new DataView(imageData));
          assert.equal(checksum, 2980574675);
      });
  });
});