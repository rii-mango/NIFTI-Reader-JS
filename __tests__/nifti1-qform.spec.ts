import { readHeader } from '../src/nifti.js'
import { NIFTI1 } from '../src/nifti1.js'
import { describe, it, assert } from 'vitest'
import * as fs from 'fs'

const buf = fs.readFileSync('./data/avg152T1_LR_nifti.nii')
const original = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

// returns a copy of the header with only a qform set to the given quaternion
function withQuaternion(b: number, c: number, d: number): ArrayBuffer {
  const data = original.slice(0)
  const view = new DataView(data)
  const littleEndian = (readHeader(original) as NIFTI1).littleEndian
  view.setInt16(252, 1, littleEndian) // qform_code
  view.setInt16(254, 0, littleEndian) // sform_code
  view.setFloat32(256, b, littleEndian)
  view.setFloat32(260, c, littleEndian)
  view.setFloat32(264, d, littleEndian)
  return data
}

describe('NIFTI-Reader-JS', function () {
  describe('nifti-1 qform test', function () {
    it('affine should match getQformMat() when b, c, d have norm slightly above 1', function () {
      // 180 degree rotation about y whose float32 encoding has norm > 1
      const nifti1 = readHeader(withQuaternion(0, 1.0000001, 0)) as NIFTI1
      assert.equal(0, nifti1.quatern_a)
      const qformMat = nifti1.getQformMat()
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          assert.isFalse(Number.isNaN(nifti1.affine[row][col]))
          assert.closeTo(nifti1.affine[row][col], qformMat[row][col], 1e-6)
        }
      }
    })

    it('should not modify the stored b, c, d', function () {
      const data = withQuaternion(0.7072, 0.7072, 0)
      const nifti1 = readHeader(data) as NIFTI1
      assert.equal(Math.fround(0.7072), nifti1.quatern_b)
      assert.equal(Math.fround(0.7072), nifti1.quatern_c)

      const written = new DataView(nifti1.toArrayBuffer())
      const view = new DataView(data)
      for (const offset of [256, 260, 264]) {
        assert.equal(view.getFloat32(offset, nifti1.littleEndian), written.getFloat32(offset, nifti1.littleEndian))
      }
    })
  })
})
