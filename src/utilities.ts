import { NIFTIEXTENSION } from './nifti-extension.js'

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export class Utils {
  /*** Static Pseudo-constants ***/

  public static crcTable: number[] | null = null
  public static readonly GUNZIP_MAGIC_COOKIE1 = 31
  public static readonly GUNZIP_MAGIC_COOKIE2 = 139

  /*** Static methods ***/

  static getStringAt(data: DataView, start: number, end: number): string {
    var str = '',
      ctr,
      ch

    for (ctr = start; ctr < end; ctr += 1) {
      ch = data.getUint8(ctr)

      if (ch !== 0) {
        str += String.fromCharCode(ch)
      }
    }

    return str
  }

  static getByteAt = function (data: DataView, start: number): number {
    return data.getUint8(start)
  }

  static getShortAt = function (data: DataView, start: number, littleEndian: boolean) {
    return data.getInt16(start, littleEndian)
  }

  static getIntAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getInt32(start, littleEndian)
  }

  static getFloatAt(data: DataView, start: number, littleEndian: boolean) {
    return data.getFloat32(start, littleEndian)
  }

  static getDoubleAt(data: DataView, start: number, littleEndian: boolean) {
    return data.getFloat64(start, littleEndian)
  }

  static getInt64At(dataView: DataView, index: number, littleEndian: boolean): number {
    const low = dataView.getUint32(index, littleEndian)
    const high = dataView.getInt32(index + 4, littleEndian)
    let result: number
    if (littleEndian) {
      result = high * 2 ** 32 + low
    } else {
      result = low * 2 ** 32 + high
    }
    // Proper sign extension if the high part is negative
    if (high < 0) {
      result += -1 * 2 ** 32 * 2 ** 32
    }
    return result
  }

  static getUint64At(dataView: DataView, index: number, littleEndian: boolean): number {
    const low = dataView.getUint32(index + (littleEndian ? 0 : 4), littleEndian)
    const high = dataView.getUint32(index + (littleEndian ? 4 : 0), littleEndian)
    
    // Combine high and low bits. For littleEndian, high bits go first in the multiplication
    return littleEndian
      ? high * 2 ** 32 + low
      : low * 2 ** 32 + high
  }

  static getExtensionsAt(data: DataView, start: number, littleEndian: boolean, voxOffset: number) {
    let extensions: NIFTIEXTENSION[] = []
    let extensionByteIndex = start

    // Multiple extended header sections are allowed
    while (extensionByteIndex < voxOffset) {
      // assume same endianess as header until proven otherwise
      let extensionLittleEndian = littleEndian
      let esize = Utils.getIntAt(data, extensionByteIndex, littleEndian)
      if (!esize) {
        break // no more extensions
      }

      // check if this takes us past vox_offset
      if (esize + extensionByteIndex > voxOffset) {
        // check if reversing byte order gets a proper size
        extensionLittleEndian = !extensionLittleEndian
        esize = Utils.getIntAt(data, extensionByteIndex, extensionLittleEndian)
        if (esize + extensionByteIndex > voxOffset) {
          throw new Error('This does not appear to be a valid NIFTI extension')
        }
      }

      // esize must be a positive integral multiple of 16
      if (esize % 16 != 0) {
        throw new Error('This does not appear to be a NIFTI extension')
      }

      let ecode = Utils.getIntAt(data, extensionByteIndex + 4, extensionLittleEndian)
      let edata = data.buffer.slice(extensionByteIndex + 8, extensionByteIndex + esize)
      let extension = new NIFTIEXTENSION(esize, ecode, edata, extensionLittleEndian)
      extensions.push(extension)
      extensionByteIndex += esize
    }
    return extensions
  }

  static toArrayBuffer(buffer: TypedArray): ArrayBuffer {
    var ab, view, i

    ab = new ArrayBuffer(buffer.length)
    view = new Uint8Array(ab)
    for (i = 0; i < buffer.length; i += 1) {
      view[i] = buffer[i]
    }
    return ab
  }

  static isString(obj: Object): boolean {
    return typeof obj === 'string' || obj instanceof String
  }

  static formatNumber(num: any, shortFormat: boolean | undefined = undefined): number {
    let val

    if (Utils.isString(num)) {
      val = Number(num)
    } else {
      val = num
    }

    if (shortFormat) {
      val = val.toPrecision(5)
    } else {
      val = val.toPrecision(7)
    }

    return parseFloat(val)
  }

  // http://stackoverflow.com/questions/18638900/javascript-crc32
  static makeCRCTable(): number[] {
    let c
    let crcTable: number[] = []
    for (var n = 0; n < 256; n++) {
      c = n
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      crcTable[n] = c
    }
    return crcTable
  }

  static crc32(dataView: DataView): number {
    if (!Utils.crcTable) {
      Utils.crcTable = Utils.makeCRCTable()
    }
    const crcTable = Utils.crcTable
    let crc = 0 ^ -1

    for (var i = 0; i < dataView.byteLength; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xff]
    }

    return (crc ^ -1) >>> 0
  }
}
