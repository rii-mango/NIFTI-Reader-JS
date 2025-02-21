import { NIFTI1 } from './nifti1.js';
import { Utils } from './utilities.js';
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
export class NIFTI2 {
    littleEndian = false;
    dim_info = 0;
    dims = [];
    intent_p1 = 0;
    intent_p2 = 0;
    intent_p3 = 0;
    intent_code = 0;
    datatypeCode = 0;
    numBitsPerVoxel = 0;
    slice_start = 0;
    slice_end = 0;
    slice_code = 0;
    pixDims = [];
    vox_offset = 0;
    scl_slope = 1;
    scl_inter = 0;
    xyzt_units = 0;
    cal_max = 0;
    cal_min = 0;
    slice_duration = 0;
    toffset = 0;
    description = '';
    aux_file = '';
    intent_name = '';
    qform_code = 0;
    sform_code = 0;
    quatern_b = 0;
    quatern_c = 0;
    quatern_d = 0;
    qoffset_x = 0;
    qoffset_y = 0;
    qoffset_z = 0;
    affine = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    magic = '0';
    extensionFlag = [0, 0, 0, 0];
    extensions = [];
    extensionSize = 0;
    extensionCode = 0;
    /*** Static Pseudo-constants ***/
    static MAGIC_COOKIE = 540;
    static MAGIC_NUMBER_LOCATION = 4;
    static MAGIC_NUMBER = [0x6e, 0x2b, 0x32, 0, 0x0d, 0x0a, 0x1a, 0x0a]; // n+2\0
    static MAGIC_NUMBER2 = [0x6e, 0x69, 0x32, 0, 0x0d, 0x0a, 0x1a, 0x0a]; // ni2\0
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
        var rawData = new DataView(data), magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index, array;
        if (magicCookieVal !== NIFTI2.MAGIC_COOKIE) {
            // try as little endian
            this.littleEndian = true;
            magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian);
        }
        if (magicCookieVal !== NIFTI2.MAGIC_COOKIE) {
            throw new Error('This does not appear to be a NIFTI file!');
        }
        this.magic = Utils.getStringAt(rawData, 4, 12);
        this.datatypeCode = Utils.getShortAt(rawData, 12, this.littleEndian);
        this.numBitsPerVoxel = Utils.getShortAt(rawData, 14, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 16 + ctr * 8;
            this.dims[ctr] = Utils.getInt64At(rawData, index, this.littleEndian);
        }
        this.intent_p1 = Utils.getDoubleAt(rawData, 80, this.littleEndian);
        this.intent_p2 = Utils.getDoubleAt(rawData, 88, this.littleEndian);
        this.intent_p3 = Utils.getDoubleAt(rawData, 96, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 104 + ctr * 8;
            this.pixDims[ctr] = Utils.getDoubleAt(rawData, index, this.littleEndian);
        }
        this.vox_offset = Utils.getInt64At(rawData, 168, this.littleEndian);
        this.scl_slope = Utils.getDoubleAt(rawData, 176, this.littleEndian);
        this.scl_inter = Utils.getDoubleAt(rawData, 184, this.littleEndian);
        this.cal_max = Utils.getDoubleAt(rawData, 192, this.littleEndian);
        this.cal_min = Utils.getDoubleAt(rawData, 200, this.littleEndian);
        this.slice_duration = Utils.getDoubleAt(rawData, 208, this.littleEndian);
        this.toffset = Utils.getDoubleAt(rawData, 216, this.littleEndian);
        this.slice_start = Utils.getInt64At(rawData, 224, this.littleEndian);
        this.slice_end = Utils.getInt64At(rawData, 232, this.littleEndian);
        this.description = Utils.getStringAt(rawData, 240, 240 + 80);
        this.aux_file = Utils.getStringAt(rawData, 320, 320 + 24);
        this.qform_code = Utils.getIntAt(rawData, 344, this.littleEndian);
        this.sform_code = Utils.getIntAt(rawData, 348, this.littleEndian);
        this.quatern_b = Utils.getDoubleAt(rawData, 352, this.littleEndian);
        this.quatern_c = Utils.getDoubleAt(rawData, 360, this.littleEndian);
        this.quatern_d = Utils.getDoubleAt(rawData, 368, this.littleEndian);
        this.qoffset_x = Utils.getDoubleAt(rawData, 376, this.littleEndian);
        this.qoffset_y = Utils.getDoubleAt(rawData, 384, this.littleEndian);
        this.qoffset_z = Utils.getDoubleAt(rawData, 392, this.littleEndian);
        for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
            for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
                index = 400 + (ctrOut * 4 + ctrIn) * 8;
                this.affine[ctrOut][ctrIn] = Utils.getDoubleAt(rawData, index, this.littleEndian);
            }
        }
        this.affine[3][0] = 0;
        this.affine[3][1] = 0;
        this.affine[3][2] = 0;
        this.affine[3][3] = 1;
        this.slice_code = Utils.getIntAt(rawData, 496, this.littleEndian);
        this.xyzt_units = Utils.getIntAt(rawData, 500, this.littleEndian);
        this.intent_code = Utils.getIntAt(rawData, 504, this.littleEndian);
        this.intent_name = Utils.getStringAt(rawData, 508, 508 + 16);
        this.dim_info = Utils.getByteAt(rawData, 524);
        if (rawData.byteLength > NIFTI2.MAGIC_COOKIE) {
            this.extensionFlag[0] = Utils.getByteAt(rawData, 540);
            this.extensionFlag[1] = Utils.getByteAt(rawData, 540 + 1);
            this.extensionFlag[2] = Utils.getByteAt(rawData, 540 + 2);
            this.extensionFlag[3] = Utils.getByteAt(rawData, 540 + 3);
            if (this.extensionFlag[0]) {
                // read our extensions
                this.extensions = Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
                // set the extensionSize and extensionCode from the first extension found
                this.extensionSize = this.extensions[0].esize;
                this.extensionCode = this.extensions[0].ecode;
            }
        }
    }
    /**
     * Returns a formatted string of header fields.
     * @returns {string}
     */
    toFormattedString() {
        var fmt = Utils.formatNumber, string = '';
        string += 'Datatype = ' + +this.datatypeCode + ' (' + this.getDatatypeCodeString(this.datatypeCode) + ')\n';
        string += 'Bits Per Voxel = ' + ' = ' + this.numBitsPerVoxel + '\n';
        string +=
            'Image Dimensions' +
                ' (1-8): ' +
                this.dims[0] +
                ', ' +
                this.dims[1] +
                ', ' +
                this.dims[2] +
                ', ' +
                this.dims[3] +
                ', ' +
                this.dims[4] +
                ', ' +
                this.dims[5] +
                ', ' +
                this.dims[6] +
                ', ' +
                this.dims[7] +
                '\n';
        string += 'Intent Parameters (1-3): ' + this.intent_p1 + ', ' + this.intent_p2 + ', ' + this.intent_p3 + '\n';
        string +=
            'Voxel Dimensions (1-8): ' +
                fmt(this.pixDims[0]) +
                ', ' +
                fmt(this.pixDims[1]) +
                ', ' +
                fmt(this.pixDims[2]) +
                ', ' +
                fmt(this.pixDims[3]) +
                ', ' +
                fmt(this.pixDims[4]) +
                ', ' +
                fmt(this.pixDims[5]) +
                ', ' +
                fmt(this.pixDims[6]) +
                ', ' +
                fmt(this.pixDims[7]) +
                '\n';
        string += 'Image Offset = ' + this.vox_offset + '\n';
        string += 'Data Scale:  Slope = ' + fmt(this.scl_slope) + '  Intercept = ' + fmt(this.scl_inter) + '\n';
        string += 'Display Range:  Max = ' + fmt(this.cal_max) + '  Min = ' + fmt(this.cal_min) + '\n';
        string += 'Slice Duration = ' + this.slice_duration + '\n';
        string += 'Time Axis Shift = ' + this.toffset + '\n';
        string += 'Slice Start = ' + this.slice_start + '\n';
        string += 'Slice End = ' + this.slice_end + '\n';
        string += 'Description: "' + this.description + '"\n';
        string += 'Auxiliary File: "' + this.aux_file + '"\n';
        string += 'Q-Form Code = ' + this.qform_code + ' (' + this.getTransformCodeString(this.qform_code) + ')\n';
        string += 'S-Form Code = ' + this.sform_code + ' (' + this.getTransformCodeString(this.sform_code) + ')\n';
        string +=
            'Quaternion Parameters:  ' +
                'b = ' +
                fmt(this.quatern_b) +
                '  ' +
                'c = ' +
                fmt(this.quatern_c) +
                '  ' +
                'd = ' +
                fmt(this.quatern_d) +
                '\n';
        string +=
            'Quaternion Offsets:  ' +
                'x = ' +
                this.qoffset_x +
                '  ' +
                'y = ' +
                this.qoffset_y +
                '  ' +
                'z = ' +
                this.qoffset_z +
                '\n';
        string +=
            'S-Form Parameters X: ' +
                fmt(this.affine[0][0]) +
                ', ' +
                fmt(this.affine[0][1]) +
                ', ' +
                fmt(this.affine[0][2]) +
                ', ' +
                fmt(this.affine[0][3]) +
                '\n';
        string +=
            'S-Form Parameters Y: ' +
                fmt(this.affine[1][0]) +
                ', ' +
                fmt(this.affine[1][1]) +
                ', ' +
                fmt(this.affine[1][2]) +
                ', ' +
                fmt(this.affine[1][3]) +
                '\n';
        string +=
            'S-Form Parameters Z: ' +
                fmt(this.affine[2][0]) +
                ', ' +
                fmt(this.affine[2][1]) +
                ', ' +
                fmt(this.affine[2][2]) +
                ', ' +
                fmt(this.affine[2][3]) +
                '\n';
        string += 'Slice Code = ' + this.slice_code + '\n';
        string +=
            'Units Code = ' +
                this.xyzt_units +
                ' (' +
                this.getUnitsCodeString(NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) +
                ', ' +
                this.getUnitsCodeString(NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) +
                ')\n';
        string += 'Intent Code = ' + this.intent_code + '\n';
        string += 'Intent Name: "' + this.intent_name + '"\n';
        string += 'Dim Info = ' + this.dim_info + '\n';
        return string;
    }
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation = function () {
        return NIFTI2.MAGIC_COOKIE + 4;
    };
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize = NIFTI1.prototype.getExtensionSize;
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode = NIFTI1.prototype.getExtensionCode;
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension = NIFTI1.prototype.addExtension;
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension = NIFTI1.prototype.removeExtension;
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString = NIFTI1.prototype.getDatatypeCodeString;
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString = NIFTI1.prototype.getTransformCodeString;
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString = NIFTI1.prototype.getUnitsCodeString;
    /**
     * Returns the qform matrix.
     * @returns {Array.<Array.<number>>}
     */
    getQformMat = NIFTI1.prototype.getQformMat;
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
    convertNiftiQFormToNiftiSForm = NIFTI1.prototype.convertNiftiQFormToNiftiSForm;
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA = NIFTI1.prototype.convertNiftiSFormToNEMA;
    nifti_mat33_mul = NIFTI1.prototype.nifti_mat33_mul;
    nifti_mat33_determ = NIFTI1.prototype.nifti_mat33_determ;
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions = false) {
        const INT64_SIZE = 8;
        const DOUBLE_SIZE = 8;
        let byteSize = 540 + 4; // +4 for extension bytes
        // calculate necessary size
        if (includeExtensions) {
            for (let extension of this.extensions) {
                byteSize += extension.esize;
            }
        }
        let byteArray = new Uint8Array(byteSize);
        let view = new DataView(byteArray.buffer);
        // sizeof_hdr
        view.setInt32(0, 540, this.littleEndian);
        // magic
        byteArray.set(new TextEncoder().encode(this.magic), 4);
        // datatype
        view.setInt16(12, this.datatypeCode, this.littleEndian);
        // bitpix
        view.setInt16(14, this.numBitsPerVoxel, this.littleEndian);
        // dim[8]
        for (let i = 0; i < 8; i++) {
            view.setBigInt64(16 + INT64_SIZE * i, BigInt(this.dims[i]), this.littleEndian);
        }
        // intent_p1
        view.setFloat64(80, this.intent_p1, this.littleEndian);
        // intent_p2
        view.setFloat64(88, this.intent_p2, this.littleEndian);
        // intent_p3
        view.setFloat64(96, this.intent_p3, this.littleEndian);
        // pixdim
        for (let i = 0; i < 8; i++) {
            view.setFloat64(104 + DOUBLE_SIZE * i, this.pixDims[i], this.littleEndian);
        }
        // vox_offset
        view.setBigInt64(168, BigInt(this.vox_offset), this.littleEndian);
        // scl_slope
        view.setFloat64(176, this.scl_slope, this.littleEndian);
        // scl_inter
        view.setFloat64(184, this.scl_inter, this.littleEndian);
        // cal_max
        view.setFloat64(192, this.cal_max, this.littleEndian);
        // cal_min
        view.setFloat64(200, this.cal_min, this.littleEndian);
        // slice_duration
        view.setFloat64(208, this.slice_duration, this.littleEndian);
        // toffset
        view.setFloat64(216, this.toffset, this.littleEndian);
        // slice_start
        view.setBigInt64(224, BigInt(this.slice_start), this.littleEndian);
        // slice end
        view.setBigInt64(232, BigInt(this.slice_end), this.littleEndian);
        // descrip
        byteArray.set(new TextEncoder().encode(this.description), 240);
        // aux_file
        byteArray.set(new TextEncoder().encode(this.aux_file), 320);
        // qform_code
        view.setInt32(344, this.qform_code, this.littleEndian);
        // sform_code
        view.setInt32(348, this.sform_code, this.littleEndian);
        // quatern_b
        view.setFloat64(352, this.quatern_b, this.littleEndian);
        // quatern_c
        view.setFloat64(360, this.quatern_c, this.littleEndian);
        // quatern_d
        view.setFloat64(368, this.quatern_d, this.littleEndian);
        // qoffset_x
        view.setFloat64(376, this.qoffset_x, this.littleEndian);
        // qoffset_y
        view.setFloat64(384, this.qoffset_y, this.littleEndian);
        // qoffset_z
        view.setFloat64(392, this.qoffset_z, this.littleEndian);
        // srow_x[4], srow_y[4], and srow_z[4]
        const flattened = this.affine.flat();
        // we only want the first three rows
        for (let i = 0; i < 12; i++) {
            view.setFloat64(400 + DOUBLE_SIZE * i, flattened[i], this.littleEndian);
        }
        // slice_code
        view.setInt32(496, this.slice_code, this.littleEndian);
        //  xyzt_units
        view.setInt32(500, this.xyzt_units, this.littleEndian);
        //  intent_code
        view.setInt32(504, this.intent_code, this.littleEndian);
        //  intent_name
        byteArray.set(new TextEncoder().encode(this.intent_name), 508);
        // dim_info
        view.setUint8(524, this.dim_info);
        // add our extension data
        if (includeExtensions) {
            byteArray.set(Uint8Array.from([1, 0, 0, 0]), 540);
            let extensionByteIndex = this.getExtensionLocation();
            for (const extension of this.extensions) {
                view.setInt32(extensionByteIndex, extension.esize, extension.littleEndian);
                view.setInt32(extensionByteIndex + 4, extension.ecode, extension.littleEndian);
                byteArray.set(new Uint8Array(extension.edata), extensionByteIndex + 8);
                extensionByteIndex += extension.esize;
            }
        }
        else {
            // In a .nii file, these 4 bytes will always be present
            byteArray.set(new Uint8Array(4).fill(0), 540);
        }
        return byteArray.buffer;
    }
}
//# sourceMappingURL=nifti2.js.map