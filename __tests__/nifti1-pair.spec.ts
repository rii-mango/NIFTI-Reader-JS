import { isCompressed, readHeader, readImage, decompress, isNIFTI1, isNIFTI } from "../src/nifti";
import { NIFTI1 } from "../src/nifti1";
import chai, { assert, expect } from "chai";
import * as fs from "fs";
import { Utils } from "../src/utilities";
import { NIFTI2 } from "../src/nifti2";

// uncomment the line below to get verbose logging
// chai.config.truncateThreshold = 0; // disable truncating
const buf = fs.readFileSync("./data/air.hdr.gz");
let data = Utils.toArrayBuffer(buf);
let nifti1: NIFTI1 | NIFTI2 | null;


const ibuf = fs.readFileSync('./data/air.img.gz');
let idata = Utils.toArrayBuffer(ibuf);

let bytes = null;
let clone = null;
describe('NIFTI-Reader-JS', function () {
    describe('uncompressed nifti-1 hdr/img pair test', function () {
        it('isCompressed() should return true', function () {
            assert.equal(true, isCompressed(idata));
        });


        it('should not throw error when decompressing header', function (done) {
            assert.doesNotThrow(function() {
                data = decompress(data);
                done();
            });
        });

        it('should not throw error when decompressing image', function (done) {
            assert.doesNotThrow(function() {
                idata = decompress(idata);
                done();
            });
        });

        it('isNIFTI1() should return true', function () {
            assert.equal(true, isNIFTI1(data, true));
        });

        it('isNIFTI() should return true', function () {
            assert.equal(true, isNIFTI(data, true));
        });

        it('should not throw error when reading header', function (done) {
            assert.doesNotThrow(function() {
                nifti1 = readHeader(data, true);
                done();
            });
        });

        it('dims[1] should be 79', function () {
            assert.equal(79, nifti1!.dims[1]);
        });

        it('dims[2] should be 67', function () {
            assert.equal(67, nifti1!.dims[2]);
        });

        it('dims[3] should be 64', function () {
            assert.equal(64, nifti1!.dims[3]);
        });

        it('image data checksum should equal 692149477', function () {
            var imageData = readImage(nifti1!, idata);
            var checksum = Utils.crc32(new DataView(imageData));
            assert.equal(checksum, 692149477);
        });

        it('data returned from toArrayBuffer preserves all nifti-1 properties', function() {
            nifti1 = readHeader(data, true);
            bytes = nifti1!.toArrayBuffer();
            clone = readHeader(bytes, true);
            let niftiHeaderText = JSON.stringify(nifti1);
            let cloneText = JSON.stringify(clone);            
            expect(cloneText).to.equal(niftiHeaderText);

        });

    });

});
