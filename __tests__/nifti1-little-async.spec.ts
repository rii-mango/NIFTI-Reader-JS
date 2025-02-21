import { isCompressed, readHeaderAsync, decompressAsync, isNIFTI1, readImage } from '../src/nifti.js'
import { NIFTI1 } from '../src/nifti1.js'
import { describe, it, assert, beforeEach } from 'vitest'
import * as fs from 'fs'
import { Utils } from '../src/utilities.js'
import { NIFTI2 } from '../src/nifti2.js'

let data: ArrayBuffer
let nifti1: NIFTI1 | NIFTI2 | null = null

beforeEach(async () => {
  const buf = fs.readFileSync('./data/little.nii.gz')
  data = Utils.toArrayBuffer(buf)
  if (isCompressed(data)) {
    data = await decompressAsync(data)
  }
  nifti1 = await readHeaderAsync(data)
})

describe('NIFTI-Reader-JS', function () {
  describe('nifti-1 little endian test', function () {
    it('should have a valid NIFTI header', async function () {
      assert.notEqual(nifti1, null)
      console.log(nifti1)
    })

    it('isNIFTI1() should return true', async function () {
      assert.equal(true, isNIFTI1(data))
    })

    it('numBitsPerVoxel should be 32', async function () {
      assert.equal(32, nifti1!.numBitsPerVoxel)
    })

    it('littleEndian should be true', async function () {
      assert.equal(true, nifti1!.littleEndian)
    })

    it('dims[1] should be 64', async function () {
      assert.equal(64, nifti1!.dims[1])
    })

    it('dims[2] should be 64', async function () {
      assert.equal(64, nifti1!.dims[2])
    })

    it('dims[3] should be 21', async function () {
      assert.equal(21, nifti1!.dims[3])
    })

    it('image data checksum should equal 4006845507', async function () {
      const imageData = readImage(nifti1!, data)
      const checksum = Utils.crc32(new DataView(imageData))
      assert.equal(checksum, 4006845507)
    })
  })
})
