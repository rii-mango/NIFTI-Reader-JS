import { NIFTIEXTENSION } from './nifti-extension.js';
/*** Constructor ***/
/**
 * The NIFTI1 constructor.
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
 * @property {boolean} isHDR - if hdr/img format
 * @property {number[]} extensionFlag
 * @property {number} extensionSize
 * @property {number} extensionCode
 * @property {nifti.NIFTIEXTENSION[]} extensions
 * @type {Function}
 */
export declare class NIFTI1 {
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
    quatern_a: number;
    quatern_b: number;
    quatern_c: number;
    quatern_d: number;
    qoffset_x: number;
    qoffset_y: number;
    qoffset_z: number;
    affine: number[][];
    qfac: number;
    quatern_R: number[][] | undefined;
    magic: string;
    isHDR: boolean;
    extensionFlag: number[];
    extensionSize: number;
    extensionCode: number;
    extensions: NIFTIEXTENSION[];
    /*** Static Pseudo-constants ***/
    static readonly TYPE_NONE = 0;
    static readonly TYPE_BINARY = 1;
    static readonly TYPE_UINT8 = 2;
    static readonly TYPE_INT16 = 4;
    static readonly TYPE_INT32 = 8;
    static readonly TYPE_FLOAT32 = 16;
    static readonly TYPE_COMPLEX64 = 32;
    static readonly TYPE_FLOAT64 = 64;
    static readonly TYPE_RGB24 = 128;
    static readonly TYPE_INT8 = 256;
    static readonly TYPE_UINT16 = 512;
    static readonly TYPE_UINT32 = 768;
    static readonly TYPE_INT64 = 1024;
    static readonly TYPE_UINT64 = 1280;
    static readonly TYPE_FLOAT128 = 1536;
    static readonly TYPE_COMPLEX128 = 1792;
    static readonly TYPE_COMPLEX256 = 2048;
    static readonly XFORM_UNKNOWN = 0;
    static readonly XFORM_SCANNER_ANAT = 1;
    static readonly XFORM_ALIGNED_ANAT = 2;
    static readonly XFORM_TALAIRACH = 3;
    static readonly XFORM_MNI_152 = 4;
    static readonly SPATIAL_UNITS_MASK = 7;
    static readonly TEMPORAL_UNITS_MASK = 56;
    static readonly UNITS_UNKNOWN = 0;
    static readonly UNITS_METER = 1;
    static readonly UNITS_MM = 2;
    static readonly UNITS_MICRON = 3;
    static readonly UNITS_SEC = 8;
    static readonly UNITS_MSEC = 16;
    static readonly UNITS_USEC = 24;
    static readonly UNITS_HZ = 32;
    static readonly UNITS_PPM = 40;
    static readonly UNITS_RADS = 48;
    static readonly MAGIC_COOKIE = 348;
    static readonly STANDARD_HEADER_SIZE = 348;
    static readonly MAGIC_NUMBER_LOCATION = 344;
    static readonly MAGIC_NUMBER: number[];
    static readonly MAGIC_NUMBER2: number[];
    static readonly EXTENSION_HEADER_SIZE = 8;
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
    getQformMat(): Array<Array<number>>;
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
    convertNiftiQFormToNiftiSForm(qb: number, qc: number, qd: number, qx: number, qy: number, qz: number, dx: number, dy: number, dz: number, qfac: number): Array<Array<number>>;
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA(R: Array<Array<number>>): string | null;
    nifti_mat33_mul: (A: number[][], B: number[][]) => number[][];
    nifti_mat33_determ: (R: number[][]) => number;
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation(): number;
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize(data: DataView): number;
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode(data: DataView): number;
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension(extension: NIFTIEXTENSION, index?: number): void;
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension(index: number): void;
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions?: boolean): ArrayBuffer;
}
//# sourceMappingURL=nifti1.d.ts.map