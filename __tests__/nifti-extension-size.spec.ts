import { describe, it, assert } from 'vitest'
import { Utils } from '../src/utilities.js'
import { NIFTIEXTENSION } from '../src/nifti.js'

const START = 352

// builds a buffer with extensions starting at START, each given as [esize, ecode, littleEndian]
function buildExtensions(extensions: [number, number, boolean][], voxOffset: number): DataView {
  const view = new DataView(new ArrayBuffer(voxOffset))
  let index = START
  for (const [esize, ecode, littleEndian] of extensions) {
    view.setInt32(index, esize, littleEndian)
    view.setInt32(index + 4, ecode, littleEndian)
    index += Math.abs(esize)
  }
  return view
}

describe('NIFTI-Reader-JS', function () {
  describe('extension size validation', function () {
    it('constructor should reject negative and zero sizes', function () {
      assert.throws(() => new NIFTIEXTENSION(-16, 4, new ArrayBuffer(8), true))
      assert.throws(() => new NIFTIEXTENSION(0, 4, new ArrayBuffer(0), true))
    })

    it('constructor should accept a 16 byte extension', function () {
      assert.doesNotThrow(() => new NIFTIEXTENSION(16, 4, new ArrayBuffer(8), true))
    })

    it('should throw instead of looping on a negative esize', function () {
      // second extension points back at the first, which previously looped forever
      const view = buildExtensions(
        [
          [32, 4, true],
          [-32, 4, true]
        ],
        448
      )
      assert.throws(() => Utils.getExtensionsAt(view, START, true, 448))
    })

    it('should read an extension stored in the opposite byte order', function () {
      // 144 big-endian reads as a negative number when interpreted little-endian
      const view = buildExtensions([[144, 6, false]], 512)
      const extensions = Utils.getExtensionsAt(view, START, true, 512)
      assert.equal(1, extensions.length)
      assert.equal(144, extensions[0].esize)
      assert.equal(6, extensions[0].ecode)
      assert.equal(false, extensions[0].littleEndian)
    })
  })
})
