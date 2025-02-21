import { readHeaderAsync } from '../src/nifti.js'
import { NIFTI1 } from '../src/nifti1.js'
import * as fs from 'fs'
import { Utils } from '../src/utilities.js'
import { NIFTI2 } from '../src/nifti2.js'
import { NIFTIEXTENSION } from '../src/nifti.js'
import { describe, it, assert, beforeEach } from 'vitest'

let nifti2 = null

async function compress(data: ArrayBuffer): Promise<ArrayBuffer> {
  const uint8Data = new Uint8Array(data)
  const format = 'gzip' // Changed to gzip as requested
  const stream = new CompressionStream(format)
  const writer = stream.writable.getWriter()

  await writer.write(uint8Data)
  await writer.close()

  const response = new Response(stream.readable)
  return await response.arrayBuffer()
}

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

    it('extensions can be added, compressed, and serialized', async function () {
      let edata = new Int32Array(6)
      edata.fill(8)
      let newExtension = new NIFTIEXTENSION(32, 4, edata.buffer, true)
      nifti2!.addExtension(newExtension)

      assert.equal(1, nifti2!.extensions.length)

      let bytes = nifti2!.toArrayBuffer(true)
      console.log('Original bytes length:', bytes.byteLength)

      // Compress the arrayBuffer bytes using gzip
      let compressedBytes = await compress(bytes)
      console.log('Compressed bytes length:', compressedBytes.byteLength)

      // Decompress and read the header
      let copy = await readHeaderAsync(compressedBytes)

      assert.equal(1, copy!.extensions.length)
      assert.equal(4, copy!.extensions[0].ecode)
      assert.equal(24, copy!.extensions[0].edata.byteLength)
    })
  })
})
