import { NIFTI1 } from "./nifti1";
import { NIFTI2 } from "./nifti2";
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
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {NIFTI1|NIFTI2|null}
 */
export declare function readHeader(data: ArrayBuffer, isHdrImgPairOK?: boolean): NIFTI1 | NIFTI2 | null;
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