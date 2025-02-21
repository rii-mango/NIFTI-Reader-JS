import { readHeaderAsync } from '../src/nifti.js'
import { NIFTI1 } from '../src/nifti1.js'
import * as fs from 'fs'
import { Utils } from '../src/utilities.js'
import { NIFTI2 } from '../src/nifti2.js'
import { NIFTIEXTENSION } from '../src/nifti.js'
import { describe, it, assert, beforeEach } from 'vitest'

let nifti2 = null

beforeEach(async () => {
  const buf = fs.readFileSync('./data/avg152T1_LR_nifti2.nii.gz')
  const data = Utils.toArrayBuffer(buf)
  nifti2 = await readHeaderAsync(data)
})

describe('NIFTI-Reader-JS', function () {
  const EXPECTED_EXTENSION_LENGTH = 376

  describe('nifti-2 extension test', function () {
    it('should not throw error when reading header', async function () {
      assert.doesNotThrow(() => {
        if (!nifti2) {
          throw new Error('Failed to read NIFTI header')
        }
      })
    })

    it('extensions can be added and serialized', async function () {
      let edata = new Int32Array(6)
      edata.fill(8)
      let newExtension = new NIFTIEXTENSION(32, 4, edata.buffer, true)
      nifti2!.addExtension(newExtension)

      assert.equal(1, nifti2!.extensions.length)

      let bytes = nifti2!.toArrayBuffer(true)
      let copy = await readHeaderAsync(bytes)

      assert.equal(1, copy!.extensions.length)
      assert.equal(4, copy!.extensions[0].ecode)
      assert.equal(24, copy!.extensions[0].edata.byteLength)
    })
  })
})
