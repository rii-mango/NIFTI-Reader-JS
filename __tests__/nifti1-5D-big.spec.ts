import { isCompressed, readHeader, readImage, decompress, isNIFTI1 } from '../src/nifti.js'
import { NIFTI1 } from '../src/nifti1.js'
import { describe, it, assert } from 'vitest'
import * as fs from 'fs'
import { Utils } from '../src/utilities.js'
import { NIFTI2 } from '../src/nifti2.js'

const buf = fs.readFileSync('./data/big.nii.gz')
let data = Utils.toArrayBuffer(buf)
let nifti1: NIFTI1 | NIFTI2 | null

describe('NIFTI-Reader-JS', function () {
  describe('nifti-1 big endian test', function () {
    it('isCompressed() should return true', function () {
      assert.equal(true, isCompressed(data))
    })

    it('should not throw error when decompressing', function (done) {
      assert.doesNotThrow(function () {
        data = decompress(data)
      })
    })

    it('isNIFTI1() should return true', function () {
      assert.equal(true, isNIFTI1(data))
    })

    it('should not throw error when reading header', function (done) {
      assert.doesNotThrow(function () {
        nifti1 = readHeader(data)
      })
    })

    it('numBitsPerVoxel should be 32', function () {
      assert.equal(32, nifti1!.numBitsPerVoxel)
    })

    it('littleEndian should be false', function () {
      assert.equal(false, nifti1!.littleEndian)
    })

    it('dims[1] should be 64', function () {
      assert.equal(64, nifti1!.dims[1])
    })

    it('dims[2] should be 64', function () {
      assert.equal(64, nifti1!.dims[2])
    })

    it('dims[3] should be 21', function () {
      assert.equal(21, nifti1!.dims[3])
    })

    it('image data checksum should equal 3243691439', function () {
      var imageData = readImage(nifti1!, data)
      var checksum = Utils.crc32(new DataView(imageData))
      assert.equal(checksum, 3243691439)
    })
  })
})
