import * as fflate from "fflate";
import { NIFTI1 } from "./nifti1";
import { NIFTI2 } from "./nifti2";
import { Utils } from "./utilities";
export { NIFTI1 } from "./nifti1";
export { NIFTI2 } from "./nifti2";
export { Utils } from "./utilities";
export { NIFTIEXTENSION } from "./nifti-extension";

  /*** Static Methods ***/    
  /**
   * Returns true if this data represents a NIFTI-1 header.
   * @param {ArrayBuffer} data
   * @returns {boolean}
   */
  export function isNIFTI1(data: ArrayBuffer, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }

    buf = new DataView(data);

    if (buf) mag1 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 2);

    if (
      isHdrImgPairOK &&
      mag1 === NIFTI1.MAGIC_NUMBER2[0] &&
      mag2 === NIFTI1.MAGIC_NUMBER2[1] &&
      mag3 === NIFTI1.MAGIC_NUMBER2[2]
    )
      return true; // hdr/img pair

    return !!(
      mag1 === NIFTI1.MAGIC_NUMBER[0] &&
      mag2 === NIFTI1.MAGIC_NUMBER[1] &&
      mag3 === NIFTI1.MAGIC_NUMBER[2]
    );
  }

  /**
   * Returns true if this data represents a NIFTI-2 header.
   * @param {ArrayBuffer} data
   * @returns {boolean}
   */
  export function isNIFTI2(data: ArrayBuffer, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;

    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }

    buf = new DataView(data);
    mag1 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 2);

    if (
      isHdrImgPairOK &&
      mag1 === NIFTI2.MAGIC_NUMBER2[0] &&
      mag2 === NIFTI2.MAGIC_NUMBER2[1] &&
      mag3 === NIFTI2.MAGIC_NUMBER2[2]
    )
      return true; // hdr/img pair

    return !!(
      mag1 === NIFTI2.MAGIC_NUMBER[0] &&
      mag2 === NIFTI2.MAGIC_NUMBER[1] &&
      mag3 === NIFTI2.MAGIC_NUMBER[2]
    );
  }

  /**
   * Returns true if this data represents a NIFTI header.
   * @param {ArrayBuffer} data
   * @returns {boolean}
   */
  export function isNIFTI(data: ArrayBuffer, isHdrImgPairOK = false) {
    return (
      isNIFTI1(data, isHdrImgPairOK) ||
      isNIFTI2(data, isHdrImgPairOK)
    );
  }

  /**
   * Returns true if this data is GZIP compressed.
   * @param {ArrayBuffer} data
   * @returns {boolean}
   */
  export function isCompressed(data: ArrayBuffer) {
    var buf, magicCookie1, magicCookie2;

    if (data) {
      buf = new DataView(data);

      magicCookie1 = buf.getUint8(0);
      magicCookie2 = buf.getUint8(1);

      if (magicCookie1 === Utils.GUNZIP_MAGIC_COOKIE1) {
        return true;
      }

      if (magicCookie2 === Utils.GUNZIP_MAGIC_COOKIE2) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns decompressed data.
   * @param {ArrayBuffer} data
   * @returns {ArrayBuffer}
   */
  export function decompress(data: ArrayBuffer) {
    return fflate.decompressSync(new Uint8Array(data)).buffer;
  }

  /**
   * Reads and returns the header object.
   * @param {ArrayBuffer} data
   * @returns {NIFTI1|NIFTI2}
   */
  export function readHeader(data: ArrayBuffer, isHdrImgPairOK = false) {
    var header = null;

    if (isCompressed(data)) {
      data = decompress(data);
    }

    if (isNIFTI1(data, isHdrImgPairOK)) {
      header = new NIFTI1();
    } else if (isNIFTI2(data, isHdrImgPairOK)) {
      header = new NIFTI2();
    }

    if (header) {
      header.readHeader(data);
    } else {
      throw new Error('That file does not appear to be NIFTI!');
    }

    return header;
  }

  /**
   * Returns true if this header contains an extension.
   * @param {NIFTI1|NIFTI2} header
   * @returns {boolean}
   */
  export function hasExtension(header: NIFTI1 | NIFTI2) {
    return header.extensionFlag[0] != 0;
  }

  /**
   * Returns the image data.
   * @param {NIFTI1|NIFTI2} header
   * @param {ArrayBuffer} data
   * @returns {ArrayBuffer}
   */
  export function readImage(
    header: NIFTI1 | NIFTI2,
    data: ArrayBuffer
  ) {
    var imageOffset = header.vox_offset,
      timeDim = 1,
      statDim = 1;

    if (header.dims[4]) {
      timeDim = header.dims[4];
    }

    if (header.dims[5]) {
      statDim = header.dims[5];
    }

    var imageSize =
      header.dims[1] *
      header.dims[2] *
      header.dims[3] *
      timeDim *
      statDim *
      (header.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
  }

  /**
   * Returns the extension data (including extension header).
   * @param {NIFTI1|NIFTI2} header
   * @param {ArrayBuffer} data
   * @returns {ArrayBuffer}
   */
  export function readExtension(
    header: NIFTI1 | NIFTI2,
    data: ArrayBuffer
  ) {
    var loc = header.getExtensionLocation(),
      size = header.extensionSize;

    return data.slice(loc, loc + size);
  }

  /**
   * Returns the extension data.
   * @param {NIFTI1|NIFTI2} header
   * @param {ArrayBuffer} data
   * @returns {ArrayBuffer}
   */
  export function readExtensionData(
    header: NIFTI1 | NIFTI2,
    data: ArrayBuffer
  ) {
    var loc = header.getExtensionLocation(),
      size = header.extensionSize;

    return data.slice(loc + 8, loc + size); // +8 for loc and -8 for esize and ecode
  }
