import { isCompressed, readHeader, isNIFTI } from "../src/nifti";
import { assert } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";

const buf = fs.readFileSync("./__tests__/data/not-nifti.nii");
let data = Utils.toArrayBuffer(buf);

describe('NIFTI-Reader-JS', function () {
  describe('not-nifti test', function () {
      it('isCompressed() should return false', function () {
          assert.equal(false, isCompressed(data));
      });

      it('isNIFTI() should return false', function () {
          assert.equal(false, isNIFTI(data));
      });

      it('readHeader() should return null', function () {
          assert.equal(null, readHeader(data));
      });
  });
});
