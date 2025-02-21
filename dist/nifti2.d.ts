import { NIFTIEXTENSION } from './nifti-extension.js';
/**
 * The NIFTI2 constructor.
 * @constructor
 * @property {boolean} littleEndian
 * @property {number} dim_info
 * @property {number[]} dims - image dimensions
 * @property {number} intent_p1
 * @property {number} intent_p2
 * @property {number} intent_p3
 * @property {number} intent_code
 * @property {number} datatypeCode
 * @property {number} numBitsPerVoxel
 * @property {number} slice_start
 * @property {number} slice_end
 * @property {number} slice_code
 * @property {number[]} pixDims - voxel dimensions
 * @property {number} vox_offset
 * @property {number} scl_slope
 * @property {number} scl_inter
 * @property {number} xyzt_units
 * @property {number} cal_max
 * @property {number} cal_min
 * @property {number} slice_duration
 * @property {number} toffset
 * @property {string} description
 * @property {string} aux_file
 * @property {string} intent_name
 * @property {number} qform_code
 * @property {number} sform_code
 * @property {number} quatern_b
 * @property {number} quatern_c
 * @property {number} quatern_d
 * @property {number} quatern_x
 * @property {number} quatern_y
 * @property {number} quatern_z
 * @property {Array.<Array.<number>>} affine
 * @property {string} magic
 * @property {number[]} extensionFlag
 * @property {NIFTIEXTENSION[]} extensions
 * @type {Function}
 */
export declare class NIFTI2 {
    littleEndian: boolean;
    dim_info: number;
    dims: number[];
    intent_p1: number;
    intent_p2: number;
    intent_p3: number;
    intent_code: number;
    datatypeCode: number;
    numBitsPerVoxel: number;
    slice_start: number;
    slice_end: number;
    slice_code: number;
    pixDims: number[];
    vox_offset: number;
    scl_slope: number;
    scl_inter: number;
    xyzt_units: number;
    cal_max: number;
    cal_min: number;
    slice_duration: number;
    toffset: number;
    description: string;
    aux_file: string;
    intent_name: string;
    qform_code: number;
    sform_code: number;
    quatern_b: number;
    quatern_c: number;
    quatern_d: number;
    qoffset_x: number;
    qoffset_y: number;
    qoffset_z: number;
    affine: number[][];
    magic: string;
    extensionFlag: number[];
    extensions: NIFTIEXTENSION[];
    extensionSize: number;
    extensionCode: number;
    /*** Static Pseudo-constants ***/
    static readonly MAGIC_COOKIE = 540;
    static readonly MAGIC_NUMBER_LOCATION = 4;
    static readonly MAGIC_NUMBER: number[];
    static readonly MAGIC_NUMBER2: number[];
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data: ArrayBuffer): void;
    /**
     * Returns a formatted string of header fields.
     * @returns {string}
     */
    toFormattedString(): string;
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation: () => number;
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize: (data: DataView) => number;
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode: (data: DataView) => number;
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension: (extension: NIFTIEXTENSION, index?: number) => void;
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension: (index: number) => void;
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString: (code: number) => string;
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString: (code: number) => string;
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString: (code: number) => string;
    /**
     * Returns the qform matrix.
     * @returns {Array.<Array.<number>>}
     */
    getQformMat: () => Array<Array<number>>;
    /**
     * Converts qform to an affine.  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {number} qb
     * @param {number} qc
     * @param {number} qd
     * @param {number} qx
     * @param {number} qy
     * @param {number} qz
     * @param {number} dx
     * @param {number} dy
     * @param {number} dz
     * @param {number} qfac
     * @returns {Array.<Array.<number>>}
     */
    convertNiftiQFormToNiftiSForm: (qb: number, qc: number, qd: number, qx: number, qy: number, qz: number, dx: number, dy: number, dz: number, qfac: number) => Array<Array<number>>;
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA: (R: Array<Array<number>>) => string | null;
    nifti_mat33_mul: (A: number[][], B: number[][]) => number[][];
    nifti_mat33_determ: (R: number[][]) => number;
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions?: boolean): ArrayBuffer;
}
//# sourceMappingURL=nifti2.d.ts.map