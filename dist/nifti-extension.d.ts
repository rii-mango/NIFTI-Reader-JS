/*** Constructor ***/
/**
 * The NIFTIEXTENSION constructor.
 * @constructor
 * @property {number} esize - number of bytes that form the extended header data
 * @property {number} ecode - developer group id
 * @property {ArrayBuffer} data - extension data
 * @property {boolean} littleEndian - is little endian
 * @type {Function}
 */
export declare class NIFTIEXTENSION {
    esize: number;
    ecode: number;
    edata: ArrayBuffer;
    littleEndian: boolean;
    constructor(esize: number, ecode: number, edata: ArrayBuffer, littleEndian: boolean);
    /**
     * Returns extension as ArrayBuffer.
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(): ArrayBuffer;
}
//# sourceMappingURL=nifti-extension.d.ts.map