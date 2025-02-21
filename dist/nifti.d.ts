import { NIFTI1 } from './nifti1.js';
import { NIFTI2 } from './nifti2.js';
export { NIFTI1 } from './nifti1.js';
export { NIFTI2 } from './nifti2.js';
export { Utils } from './utilities.js';
export { NIFTIEXTENSION } from './nifti-extension.js';
/*** Static Methods ***/
/**
 * Returns true if this data represents a NIFTI-1 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export declare function isNIFTI1(data: ArrayBuffer, isHdrImgPairOK?: boolean): boolean;
/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export declare function isNIFTI2(data: ArrayBuffer, isHdrImgPairOK?: boolean): boolean;
/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export declare function isNIFTI(data: ArrayBuffer, isHdrImgPairOK?: boolean): boolean;
/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export declare function isCompressed(data: ArrayBuffer): boolean;
/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export declare function decompress(data: ArrayBuffer): ArrayBufferLike;
/**
 * Returns promise of decompressed data.
 * @param {ArrayBuffer} data
 * @returns {Promise<ArrayBuffer>}
 */
export declare function decompressAsync(data: ArrayBuffer): Promise<ArrayBuffer>;
/**
 * Returns promise of decompressed initial portion of data, reads at least minOutputBytes or entire file.
 * @param {ArrayBuffer} data
 * @param {number } minOutputBytes
 * @returns {Promise<ArrayBuffer>}
 */
export declare function decompressHeaderAsync(data: ArrayBuffer, minOutputBytes?: number): Promise<ArrayBufferLike>;
/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {NIFTI1|NIFTI2}
 */
export declare function readHeader(data: ArrayBuffer, isHdrImgPairOK?: boolean): NIFTI1 | NIFTI2;
export declare function readHeaderAsync(data: ArrayBuffer, isHdrImgPairOK?: boolean): Promise<NIFTI1 | NIFTI2>;
/**
 * Returns true if this header contains an extension.
 * @param {NIFTI1|NIFTI2} header
 * @returns {boolean}
 */
export declare function hasExtension(header: NIFTI1 | NIFTI2): boolean;
/**
 * Returns the image data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export declare function readImage(header: NIFTI1 | NIFTI2, data: ArrayBuffer): ArrayBuffer;
/**
 * Returns the extension data (including extension header).
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export declare function readExtension(header: NIFTI1 | NIFTI2, data: ArrayBuffer): ArrayBuffer;
/**
 * Returns the extension data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export declare function readExtensionData(header: NIFTI1 | NIFTI2, data: ArrayBuffer): ArrayBuffer;
//# sourceMappingURL=nifti.d.ts.map