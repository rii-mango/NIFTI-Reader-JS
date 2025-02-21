import { Utils } from './utilities.js';
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
export class NIFTI1 {
    littleEndian = false;
    dim_info = 0;
    dims = [];
    intent_p1 = 0.0;
    intent_p2 = 0.0;
    intent_p3 = 0.0;
    intent_code = 0;
    datatypeCode = 0;
    numBitsPerVoxel = 0;
    slice_start = 0;
    slice_end = 0;
    slice_code = 0;
    pixDims = [];
    vox_offset = 0;
    scl_slope = 1.0;
    scl_inter = 0.0;
    xyzt_units = 0;
    cal_max = 0.0;
    cal_min = 0.0;
    slice_duration = 0.0;
    toffset = 0.0;
    description = '';
    aux_file = '';
    intent_name = '';
    qform_code = 0;
    sform_code = 0;
    quatern_a = 0.0;
    quatern_b = 0.0;
    quatern_c = 0.0;
    quatern_d = 0.0;
    qoffset_x = 0.0;
    qoffset_y = 0.0;
    qoffset_z = 0.0;
    affine = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    qfac = 1;
    quatern_R;
    magic = '0';
    isHDR = false;
    extensionFlag = [0, 0, 0, 0];
    extensionSize = 0;
    extensionCode = 0;
    extensions = [];
    /*** Static Pseudo-constants ***/
    // datatype codes
    static TYPE_NONE = 0;
    static TYPE_BINARY = 1;
    static TYPE_UINT8 = 2;
    static TYPE_INT16 = 4;
    static TYPE_INT32 = 8;
    static TYPE_FLOAT32 = 16;
    static TYPE_COMPLEX64 = 32;
    static TYPE_FLOAT64 = 64;
    static TYPE_RGB24 = 128;
    static TYPE_INT8 = 256;
    static TYPE_UINT16 = 512;
    static TYPE_UINT32 = 768;
    static TYPE_INT64 = 1024;
    static TYPE_UINT64 = 1280;
    static TYPE_FLOAT128 = 1536;
    static TYPE_COMPLEX128 = 1792;
    static TYPE_COMPLEX256 = 2048;
    // transform codes
    static XFORM_UNKNOWN = 0;
    static XFORM_SCANNER_ANAT = 1;
    static XFORM_ALIGNED_ANAT = 2;
    static XFORM_TALAIRACH = 3;
    static XFORM_MNI_152 = 4;
    // unit codes
    static SPATIAL_UNITS_MASK = 0x07;
    static TEMPORAL_UNITS_MASK = 0x38;
    static UNITS_UNKNOWN = 0;
    static UNITS_METER = 1;
    static UNITS_MM = 2;
    static UNITS_MICRON = 3;
    static UNITS_SEC = 8;
    static UNITS_MSEC = 16;
    static UNITS_USEC = 24;
    static UNITS_HZ = 32;
    static UNITS_PPM = 40;
    static UNITS_RADS = 48;
    // nifti1 codes
    static MAGIC_COOKIE = 348;
    static STANDARD_HEADER_SIZE = 348;
    static MAGIC_NUMBER_LOCATION = 344;
    static MAGIC_NUMBER = [0x6e, 0x2b, 0x31]; // n+1 (.nii)
    static MAGIC_NUMBER2 = [0x6e, 0x69, 0x31]; // ni1 (.hdr/.img)
    static EXTENSION_HEADER_SIZE = 8;
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
        var rawData = new DataView(data), magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index;
        if (magicCookieVal !== NIFTI1.MAGIC_COOKIE) {
            // try as little endian
            this.littleEndian = true;
            magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian);
        }
        if (magicCookieVal !== NIFTI1.MAGIC_COOKIE) {
            throw new Error('This does not appear to be a NIFTI file!');
        }
        this.dim_info = Utils.getByteAt(rawData, 39);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 40 + ctr * 2;
            this.dims[ctr] = Utils.getShortAt(rawData, index, this.littleEndian);
        }
        this.intent_p1 = Utils.getFloatAt(rawData, 56, this.littleEndian);
        this.intent_p2 = Utils.getFloatAt(rawData, 60, this.littleEndian);
        this.intent_p3 = Utils.getFloatAt(rawData, 64, this.littleEndian);
        this.intent_code = Utils.getShortAt(rawData, 68, this.littleEndian);
        this.datatypeCode = Utils.getShortAt(rawData, 70, this.littleEndian);
        this.numBitsPerVoxel = Utils.getShortAt(rawData, 72, this.littleEndian);
        this.slice_start = Utils.getShortAt(rawData, 74, this.littleEndian);
        for (ctr = 0; ctr < 8; ctr += 1) {
            index = 76 + ctr * 4;
            this.pixDims[ctr] = Utils.getFloatAt(rawData, index, this.littleEndian);
        }
        this.vox_offset = Utils.getFloatAt(rawData, 108, this.littleEndian);
        this.scl_slope = Utils.getFloatAt(rawData, 112, this.littleEndian);
        this.scl_inter = Utils.getFloatAt(rawData, 116, this.littleEndian);
        this.slice_end = Utils.getShortAt(rawData, 120, this.littleEndian);
        this.slice_code = Utils.getByteAt(rawData, 122);
        this.xyzt_units = Utils.getByteAt(rawData, 123);
        this.cal_max = Utils.getFloatAt(rawData, 124, this.littleEndian);
        this.cal_min = Utils.getFloatAt(rawData, 128, this.littleEndian);
        this.slice_duration = Utils.getFloatAt(rawData, 132, this.littleEndian);
        this.toffset = Utils.getFloatAt(rawData, 136, this.littleEndian);
        this.description = Utils.getStringAt(rawData, 148, 228);
        this.aux_file = Utils.getStringAt(rawData, 228, 252);
        this.qform_code = Utils.getShortAt(rawData, 252, this.littleEndian);
        this.sform_code = Utils.getShortAt(rawData, 254, this.littleEndian);
        this.quatern_b = Utils.getFloatAt(rawData, 256, this.littleEndian);
        this.quatern_c = Utils.getFloatAt(rawData, 260, this.littleEndian);
        this.quatern_d = Utils.getFloatAt(rawData, 264, this.littleEndian);
        // Added by znshje on 27/11/2021
        //
        // quatern_a is a parameter in quaternion [a, b, c, d], which is required in affine calculation (METHOD 2)
        // mentioned in the nifti1.h file
        // It can be calculated by a = sqrt(1.0-(b*b+c*c+d*d))
        this.quatern_a = Math.sqrt(1.0 - (Math.pow(this.quatern_b, 2) + Math.pow(this.quatern_c, 2) + Math.pow(this.quatern_d, 2)));
        this.qoffset_x = Utils.getFloatAt(rawData, 268, this.littleEndian);
        this.qoffset_y = Utils.getFloatAt(rawData, 272, this.littleEndian);
        this.qoffset_z = Utils.getFloatAt(rawData, 276, this.littleEndian);
        // Added by znshje on 27/11/2021
        //
        /* See: https://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h */
        if (this.qform_code < 1 && this.sform_code < 1) {
            // METHOD 0 (used when both SFORM and QFORM are unknown)
            this.affine[0][0] = this.pixDims[1];
            this.affine[1][1] = this.pixDims[2];
            this.affine[2][2] = this.pixDims[3];
        }
        if (this.qform_code > 0 && this.sform_code < this.qform_code) {
            //   METHOD 2 (used when qform_code > 0, which should be the "normal" case):
            //    ---------------------------------------------------------------------
            //    The (x,y,z) coordinates are given by the pixdim[] scales, a rotation
            //    matrix, and a shift.  This method is intended to represent
            //    "scanner-anatomical" coordinates, which are often embedded in the
            //    image header (e.g., DICOM fields (0020,0032), (0020,0037), (0028,0030),
            //    and (0018,0050)), and represent the nominal orientation and location of
            //    the data.  This method can also be used to represent "aligned"
            //    coordinates, which would typically result from some post-acquisition
            //    alignment of the volume to a standard orientation (e.g., the same
            //    subject on another day, or a rigid rotation to true anatomical
            //    orientation from the tilted position of the subject in the scanner).
            //    The formula for (x,y,z) in terms of header parameters and (i,j,k) is:
            //
            //      [ x ]   [ R11 R12 R13 ] [        pixdim[1] * i ]   [ qoffset_x ]
            //      [ y ] = [ R21 R22 R23 ] [        pixdim[2] * j ] + [ qoffset_y ]
            //      [ z ]   [ R31 R32 R33 ] [ qfac * pixdim[3] * k ]   [ qoffset_z ]
            //
            //    The qoffset_* shifts are in the NIFTI-1 header.  Note that the center
            //    of the (i,j,k)=(0,0,0) voxel (first value in the dataset array) is
            //    just (x,y,z)=(qoffset_x,qoffset_y,qoffset_z).
            //
            //    The rotation matrix R is calculated from the quatern_* parameters.
            //    This calculation is described below.
            //
            //    The scaling factor qfac is either 1 or -1.  The rotation matrix R
            //    defined by the quaternion parameters is "proper" (has determinant 1).
            //    This may not fit the needs of the data; for example, if the image
            //    grid is
            //      i increases from Left-to-Right
            //      j increases from Anterior-to-Posterior
            //      k increases from Inferior-to-Superior
            //    Then (i,j,k) is a left-handed triple.  In this example, if qfac=1,
            //    the R matrix would have to be
            //
            //      [  1   0   0 ]
            //      [  0  -1   0 ]  which is "improper" (determinant = -1).
            //      [  0   0   1 ]
            //
            //    If we set qfac=-1, then the R matrix would be
            //
            //      [  1   0   0 ]
            //      [  0  -1   0 ]  which is proper.
            //      [  0   0  -1 ]
            //
            //    This R matrix is represented by quaternion [a,b,c,d] = [0,1,0,0]
            //    (which encodes a 180 degree rotation about the x-axis).
            // Define a, b, c, d for coding covenience
            const a = this.quatern_a;
            const b = this.quatern_b;
            const c = this.quatern_c;
            const d = this.quatern_d;
            this.qfac = this.pixDims[0] === 0 ? 1 : this.pixDims[0];
            this.quatern_R = [
                [a * a + b * b - c * c - d * d, 2 * b * c - 2 * a * d, 2 * b * d + 2 * a * c],
                [2 * b * c + 2 * a * d, a * a + c * c - b * b - d * d, 2 * c * d - 2 * a * b],
                [2 * b * d - 2 * a * c, 2 * c * d + 2 * a * b, a * a + d * d - c * c - b * b]
            ];
            for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
                for (ctrIn = 0; ctrIn < 3; ctrIn += 1) {
                    this.affine[ctrOut][ctrIn] = this.quatern_R[ctrOut][ctrIn] * this.pixDims[ctrIn + 1];
                    if (ctrIn === 2) {
                        this.affine[ctrOut][ctrIn] *= this.qfac;
                    }
                }
            }
            // The last row of affine matrix is the offset vector
            this.affine[0][3] = this.qoffset_x;
            this.affine[1][3] = this.qoffset_y;
            this.affine[2][3] = this.qoffset_z;
        }
        else if (this.sform_code > 0) {
            //    METHOD 3 (used when sform_code > 0):
            //    -----------------------------------
            //    The (x,y,z) coordinates are given by a general affine transformation
            //    of the (i,j,k) indexes:
            //
            //      x = srow_x[0] * i + srow_x[1] * j + srow_x[2] * k + srow_x[3]
            //      y = srow_y[0] * i + srow_y[1] * j + srow_y[2] * k + srow_y[3]
            //      z = srow_z[0] * i + srow_z[1] * j + srow_z[2] * k + srow_z[3]
            //
            //    The srow_* vectors are in the NIFTI_1 header.  Note that no use is
            //    made of pixdim[] in this method.
            for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
                for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
                    index = 280 + (ctrOut * 4 + ctrIn) * 4;
                    this.affine[ctrOut][ctrIn] = Utils.getFloatAt(rawData, index, this.littleEndian);
                }
            }
        }
        this.affine[3][0] = 0;
        this.affine[3][1] = 0;
        this.affine[3][2] = 0;
        this.affine[3][3] = 1;
        this.intent_name = Utils.getStringAt(rawData, 328, 344);
        this.magic = Utils.getStringAt(rawData, 344, 348);
        this.isHDR = this.magic === String.fromCharCode.apply(null, NIFTI1.MAGIC_NUMBER2);
        if (rawData.byteLength > NIFTI1.MAGIC_COOKIE) {
            this.extensionFlag[0] = Utils.getByteAt(rawData, 348);
            this.extensionFlag[1] = Utils.getByteAt(rawData, 348 + 1);
            this.extensionFlag[2] = Utils.getByteAt(rawData, 348 + 2);
            this.extensionFlag[3] = Utils.getByteAt(rawData, 348 + 3);
            let isExtensionCapable = true;
            if (!this.isHDR && this.vox_offset <= 352)
                isExtensionCapable = false;
            if (rawData.byteLength <= 352 + 16)
                isExtensionCapable = false;
            if (isExtensionCapable && this.extensionFlag[0]) {
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
        string += 'Dim Info = ' + this.dim_info + '\n';
        string +=
            'Image Dimensions (1-8): ' +
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
        string += 'Intent Code = ' + this.intent_code + '\n';
        string += 'Datatype = ' + this.datatypeCode + ' (' + this.getDatatypeCodeString(this.datatypeCode) + ')\n';
        string += 'Bits Per Voxel = ' + this.numBitsPerVoxel + '\n';
        string += 'Slice Start = ' + this.slice_start + '\n';
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
        string += 'Slice End = ' + this.slice_end + '\n';
        string += 'Slice Code = ' + this.slice_code + '\n';
        string +=
            'Units Code = ' +
                this.xyzt_units +
                ' (' +
                this.getUnitsCodeString(NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) +
                ', ' +
                this.getUnitsCodeString(NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) +
                ')\n';
        string += 'Display Range:  Max = ' + fmt(this.cal_max) + '  Min = ' + fmt(this.cal_min) + '\n';
        string += 'Slice Duration = ' + this.slice_duration + '\n';
        string += 'Time Axis Shift = ' + this.toffset + '\n';
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
        string += 'Intent Name: "' + this.intent_name + '"\n';
        if (this.extensionFlag[0]) {
            string += 'Extension: Size = ' + this.extensionSize + '  Code = ' + this.extensionCode + '\n';
        }
        return string;
    }
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString = function (code) {
        if (code === NIFTI1.TYPE_UINT8) {
            return '1-Byte Unsigned Integer';
        }
        else if (code === NIFTI1.TYPE_INT16) {
            return '2-Byte Signed Integer';
        }
        else if (code === NIFTI1.TYPE_INT32) {
            return '4-Byte Signed Integer';
        }
        else if (code === NIFTI1.TYPE_FLOAT32) {
            return '4-Byte Float';
        }
        else if (code === NIFTI1.TYPE_FLOAT64) {
            return '8-Byte Float';
        }
        else if (code === NIFTI1.TYPE_RGB24) {
            return 'RGB';
        }
        else if (code === NIFTI1.TYPE_INT8) {
            return '1-Byte Signed Integer';
        }
        else if (code === NIFTI1.TYPE_UINT16) {
            return '2-Byte Unsigned Integer';
        }
        else if (code === NIFTI1.TYPE_UINT32) {
            return '4-Byte Unsigned Integer';
        }
        else if (code === NIFTI1.TYPE_INT64) {
            return '8-Byte Signed Integer';
        }
        else if (code === NIFTI1.TYPE_UINT64) {
            return '8-Byte Unsigned Integer';
        }
        else {
            return 'Unknown';
        }
    };
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString = function (code) {
        if (code === NIFTI1.XFORM_SCANNER_ANAT) {
            return 'Scanner';
        }
        else if (code === NIFTI1.XFORM_ALIGNED_ANAT) {
            return 'Aligned';
        }
        else if (code === NIFTI1.XFORM_TALAIRACH) {
            return 'Talairach';
        }
        else if (code === NIFTI1.XFORM_MNI_152) {
            return 'MNI';
        }
        else {
            return 'Unknown';
        }
    };
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString = function (code) {
        if (code === NIFTI1.UNITS_METER) {
            return 'Meters';
        }
        else if (code === NIFTI1.UNITS_MM) {
            return 'Millimeters';
        }
        else if (code === NIFTI1.UNITS_MICRON) {
            return 'Microns';
        }
        else if (code === NIFTI1.UNITS_SEC) {
            return 'Seconds';
        }
        else if (code === NIFTI1.UNITS_MSEC) {
            return 'Milliseconds';
        }
        else if (code === NIFTI1.UNITS_USEC) {
            return 'Microseconds';
        }
        else if (code === NIFTI1.UNITS_HZ) {
            return 'Hz';
        }
        else if (code === NIFTI1.UNITS_PPM) {
            return 'PPM';
        }
        else if (code === NIFTI1.UNITS_RADS) {
            return 'Rads';
        }
        else {
            return 'Unknown';
        }
    };
    /**
     * Returns the qform matrix.
     * @returns {Array.<Array.<number>>}
     */
    getQformMat() {
        return this.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x, this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
    }
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
    convertNiftiQFormToNiftiSForm(qb, qc, qd, qx, qy, qz, dx, dy, dz, qfac) {
        var R = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ], a, b = qb, c = qc, d = qd, xd, yd, zd;
        // last row is always [ 0 0 0 1 ]
        R[3][0] = R[3][1] = R[3][2] = 0.0;
        R[3][3] = 1.0;
        // compute a parameter from b,c,d
        a = 1.0 - (b * b + c * c + d * d);
        if (a < 0.0000001) {
            /* special case */
            a = 1.0 / Math.sqrt(b * b + c * c + d * d);
            b *= a;
            c *= a;
            d *= a; /* normalize (b,c,d) vector */
            a = 0.0; /* a = 0 ==> 180 degree rotation */
        }
        else {
            a = Math.sqrt(a); /* angle = 2*arccos(a) */
        }
        // load rotation matrix, including scaling factors for voxel sizes
        xd = dx > 0.0 ? dx : 1.0; /* make sure are positive */
        yd = dy > 0.0 ? dy : 1.0;
        zd = dz > 0.0 ? dz : 1.0;
        if (qfac < 0.0) {
            zd = -zd; /* left handedness? */
        }
        R[0][0] = (a * a + b * b - c * c - d * d) * xd;
        R[0][1] = 2.0 * (b * c - a * d) * yd;
        R[0][2] = 2.0 * (b * d + a * c) * zd;
        R[1][0] = 2.0 * (b * c + a * d) * xd;
        R[1][1] = (a * a + c * c - b * b - d * d) * yd;
        R[1][2] = 2.0 * (c * d - a * b) * zd;
        R[2][0] = 2.0 * (b * d - a * c) * xd;
        R[2][1] = 2.0 * (c * d + a * b) * yd;
        R[2][2] = (a * a + d * d - c * c - b * b) * zd;
        // load offsets
        R[0][3] = qx;
        R[1][3] = qy;
        R[2][3] = qz;
        return R;
    }
    /**
     * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
     * @param {Array.<Array.<number>>} R
     * @returns {string}
     */
    convertNiftiSFormToNEMA(R) {
        var xi, xj, xk, yi, yj, yk, zi, zj, zk, val, detQ, detP, i, j, k, p, q, r, ibest, jbest, kbest, pbest, qbest, rbest, M, vbest, Q, P, iChar, jChar, kChar, iSense, jSense, kSense;
        k = 0;
        Q = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        P = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        //if( icod == NULL || jcod == NULL || kcod == NULL ) return ; /* bad */
        //*icod = *jcod = *kcod = 0 ; /* this.errorMessage returns, if sh*t happens */
        /* load column vectors for each (i,j,k) direction from matrix */
        /*-- i axis --*/ /*-- j axis --*/ /*-- k axis --*/
        xi = R[0][0];
        xj = R[0][1];
        xk = R[0][2];
        yi = R[1][0];
        yj = R[1][1];
        yk = R[1][2];
        zi = R[2][0];
        zj = R[2][1];
        zk = R[2][2];
        /* normalize column vectors to get unit vectors along each ijk-axis */
        /* normalize i axis */
        val = Math.sqrt(xi * xi + yi * yi + zi * zi);
        if (val === 0.0) {
            /* stupid input */
            return null;
        }
        xi /= val;
        yi /= val;
        zi /= val;
        /* normalize j axis */
        val = Math.sqrt(xj * xj + yj * yj + zj * zj);
        if (val === 0.0) {
            /* stupid input */
            return null;
        }
        xj /= val;
        yj /= val;
        zj /= val;
        /* orthogonalize j axis to i axis, if needed */
        val = xi * xj + yi * yj + zi * zj; /* dot product between i and j */
        if (Math.abs(val) > 1e-4) {
            xj -= val * xi;
            yj -= val * yi;
            zj -= val * zi;
            val = Math.sqrt(xj * xj + yj * yj + zj * zj); /* must renormalize */
            if (val === 0.0) {
                /* j was parallel to i? */
                return null;
            }
            xj /= val;
            yj /= val;
            zj /= val;
        }
        /* normalize k axis; if it is zero, make it the cross product i x j */
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0.0) {
            xk = yi * zj - zi * yj;
            yk = zi * xj - zj * xi;
            zk = xi * yj - yi * xj;
        }
        else {
            xk /= val;
            yk /= val;
            zk /= val;
        }
        /* orthogonalize k to i */
        val = xi * xk + yi * yk + zi * zk; /* dot product between i and k */
        if (Math.abs(val) > 1e-4) {
            xk -= val * xi;
            yk -= val * yi;
            zk -= val * zi;
            val = Math.sqrt(xk * xk + yk * yk + zk * zk);
            if (val === 0.0) {
                /* bad */
                return null;
            }
            xk /= val;
            yk /= val;
            zk /= val;
        }
        /* orthogonalize k to j */
        val = xj * xk + yj * yk + zj * zk; /* dot product between j and k */
        if (Math.abs(val) > 1e-4) {
            xk -= val * xj;
            yk -= val * yj;
            zk -= val * zj;
            val = Math.sqrt(xk * xk + yk * yk + zk * zk);
            if (val === 0.0) {
                /* bad */
                return null;
            }
            xk /= val;
            yk /= val;
            zk /= val;
        }
        Q[0][0] = xi;
        Q[0][1] = xj;
        Q[0][2] = xk;
        Q[1][0] = yi;
        Q[1][1] = yj;
        Q[1][2] = yk;
        Q[2][0] = zi;
        Q[2][1] = zj;
        Q[2][2] = zk;
        /* at this point, Q is the rotation matrix from the (i,j,k) to (x,y,z) axes */
        detQ = this.nifti_mat33_determ(Q);
        if (detQ === 0.0) {
            /* shouldn't happen unless user is a DUFIS */
            return null;
        }
        /* Build and test all possible +1/-1 coordinate permutation matrices P;
         then find the P such that the rotation matrix M=PQ is closest to the
         identity, in the sense of M having the smallest total rotation angle. */
        /* Despite the formidable looking 6 nested loops, there are
         only 3*3*3*2*2*2 = 216 passes, which will run very quickly. */
        vbest = -666.0;
        ibest = pbest = qbest = rbest = 1;
        jbest = 2;
        kbest = 3;
        for (i = 1; i <= 3; i += 1) {
            /* i = column number to use for row #1 */
            for (j = 1; j <= 3; j += 1) {
                /* j = column number to use for row #2 */
                if (i !== j) {
                    for (k = 1; k <= 3; k += 1) {
                        /* k = column number to use for row #3 */
                        if (!(i === k || j === k)) {
                            P[0][0] = P[0][1] = P[0][2] = P[1][0] = P[1][1] = P[1][2] = P[2][0] = P[2][1] = P[2][2] = 0.0;
                            for (p = -1; p <= 1; p += 2) {
                                /* p,q,r are -1 or +1      */
                                for (q = -1; q <= 1; q += 2) {
                                    /* and go into rows #1,2,3 */
                                    for (r = -1; r <= 1; r += 2) {
                                        P[0][i - 1] = p;
                                        P[1][j - 1] = q;
                                        P[2][k - 1] = r;
                                        detP = this.nifti_mat33_determ(P); /* sign of permutation */
                                        if (detP * detQ > 0.0) {
                                            M = this.nifti_mat33_mul(P, Q);
                                            /* angle of M rotation = 2.0*acos(0.5*sqrt(1.0+trace(M)))       */
                                            /* we want largest trace(M) == smallest angle == M nearest to I */
                                            val = M[0][0] + M[1][1] + M[2][2]; /* trace */
                                            if (val > vbest) {
                                                vbest = val;
                                                ibest = i;
                                                jbest = j;
                                                kbest = k;
                                                pbest = p;
                                                qbest = q;
                                                rbest = r;
                                            }
                                        } /* doesn't match sign of Q */
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        /* At this point ibest is 1 or 2 or 3; pbest is -1 or +1; etc.
    
         The matrix P that corresponds is the best permutation approximation
         to Q-inverse; that is, P (approximately) takes (x,y,z) coordinates
         to the (i,j,k) axes.
    
         For example, the first row of P (which contains pbest in column ibest)
         determines the way the i axis points relative to the anatomical
         (x,y,z) axes.  If ibest is 2, then the i axis is along the y axis,
         which is direction P2A (if pbest > 0) or A2P (if pbest < 0).
    
         So, using ibest and pbest, we can assign the output code for
         the i axis.  Mutatis mutandis for the j and k axes, of course. */
        iChar = jChar = kChar = iSense = jSense = kSense = '';
        switch (ibest * pbest) {
            case 1 /*i = NIFTI_L2R*/:
                iChar = 'X';
                iSense = '+';
                break;
            case -1 /*i = NIFTI_R2L*/:
                iChar = 'X';
                iSense = '-';
                break;
            case 2 /*i = NIFTI_P2A*/:
                iChar = 'Y';
                iSense = '+';
                break;
            case -2 /*i = NIFTI_A2P*/:
                iChar = 'Y';
                iSense = '-';
                break;
            case 3 /*i = NIFTI_I2S*/:
                iChar = 'Z';
                iSense = '+';
                break;
            case -3 /*i = NIFTI_S2I*/:
                iChar = 'Z';
                iSense = '-';
                break;
        }
        switch (jbest * qbest) {
            case 1 /*j = NIFTI_L2R*/:
                jChar = 'X';
                jSense = '+';
                break;
            case -1 /*j = NIFTI_R2L*/:
                jChar = 'X';
                jSense = '-';
                break;
            case 2 /*j = NIFTI_P2A*/:
                jChar = 'Y';
                jSense = '+';
                break;
            case -2 /*j = NIFTI_A2P*/:
                jChar = 'Y';
                jSense = '-';
                break;
            case 3 /*j = NIFTI_I2S*/:
                jChar = 'Z';
                jSense = '+';
                break;
            case -3 /*j = NIFTI_S2I*/:
                jChar = 'Z';
                jSense = '-';
                break;
        }
        switch (kbest * rbest) {
            case 1 /*k = NIFTI_L2R*/:
                kChar = 'X';
                kSense = '+';
                break;
            case -1 /*k = NIFTI_R2L*/:
                kChar = 'X';
                kSense = '-';
                break;
            case 2 /*k = NIFTI_P2A*/:
                kChar = 'Y';
                kSense = '+';
                break;
            case -2 /*k = NIFTI_A2P*/:
                kChar = 'Y';
                kSense = '-';
                break;
            case 3 /*k = NIFTI_I2S*/:
                kChar = 'Z';
                kSense = '+';
                break;
            case -3 /*k = NIFTI_S2I*/:
                kChar = 'Z';
                kSense = '-';
                break;
        }
        return iChar + jChar + kChar + iSense + jSense + kSense;
    }
    nifti_mat33_mul = function (A, B) {
        var C = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ], i, j;
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < 3; j += 1) {
                C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
            }
        }
        return C;
    };
    nifti_mat33_determ = function (R) {
        var r11, r12, r13, r21, r22, r23, r31, r32, r33;
        /*  INPUT MATRIX:  */
        r11 = R[0][0];
        r12 = R[0][1];
        r13 = R[0][2];
        r21 = R[1][0];
        r22 = R[1][1];
        r23 = R[1][2];
        r31 = R[2][0];
        r32 = R[2][1];
        r33 = R[2][2];
        return r11 * r22 * r33 - r11 * r32 * r23 - r21 * r12 * r33 + r21 * r32 * r13 + r31 * r12 * r23 - r31 * r22 * r13;
    };
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation() {
        return NIFTI1.MAGIC_COOKIE + 4;
    }
    /**
     * Returns the extension size.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionSize(data) {
        return Utils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
    }
    /**
     * Returns the extension code.
     * @param {DataView} data
     * @returns {number}
     */
    getExtensionCode(data) {
        return Utils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
    }
    /**
     * Adds an extension
     * @param {NIFTIEXTENSION} extension
     * @param {number} index
     */
    addExtension(extension, index = -1) {
        if (index == -1) {
            this.extensions.push(extension);
        }
        else {
            this.extensions.splice(index, 0, extension);
        }
        this.vox_offset += extension.esize;
    }
    /**
     * Removes an extension
     * @param {number} index
     */
    removeExtension(index) {
        let extension = this.extensions[index];
        if (extension) {
            this.vox_offset -= extension.esize;
        }
        this.extensions.splice(index, 1);
    }
    /**
     * Returns header as ArrayBuffer.
     * @param {boolean} includeExtensions - should extension bytes be included
     * @returns {ArrayBuffer}
     */
    toArrayBuffer(includeExtensions = false) {
        const SHORT_SIZE = 2;
        const FLOAT32_SIZE = 4;
        let byteSize = 348 + 4; // + 4 for the extension bytes
        // calculate necessary size
        if (includeExtensions) {
            for (let extension of this.extensions) {
                byteSize += extension.esize;
            }
        }
        let byteArray = new Uint8Array(byteSize);
        let view = new DataView(byteArray.buffer);
        // sizeof_hdr
        view.setInt32(0, 348, this.littleEndian);
        // data_type, db_name, extents, session_error, regular are not used
        // dim_info
        view.setUint8(39, this.dim_info);
        // dims
        for (let i = 0; i < 8; i++) {
            view.setUint16(40 + SHORT_SIZE * i, this.dims[i], this.littleEndian);
        }
        // intent_p1, intent_p2, intent_p3
        view.setFloat32(56, this.intent_p1, this.littleEndian);
        view.setFloat32(60, this.intent_p2, this.littleEndian);
        view.setFloat32(64, this.intent_p3, this.littleEndian);
        // intent_code, datatype, bitpix, slice_start
        view.setInt16(68, this.intent_code, this.littleEndian);
        view.setInt16(70, this.datatypeCode, this.littleEndian);
        view.setInt16(72, this.numBitsPerVoxel, this.littleEndian);
        view.setInt16(74, this.slice_start, this.littleEndian);
        // pixdim[8], vox_offset, scl_slope, scl_inter
        for (let i = 0; i < 8; i++) {
            view.setFloat32(76 + FLOAT32_SIZE * i, this.pixDims[i], this.littleEndian);
        }
        view.setFloat32(108, this.vox_offset, this.littleEndian);
        view.setFloat32(112, this.scl_slope, this.littleEndian);
        view.setFloat32(116, this.scl_inter, this.littleEndian);
        // slice_end
        view.setInt16(120, this.slice_end, this.littleEndian);
        // slice_code, xyzt_units
        view.setUint8(122, this.slice_code);
        view.setUint8(123, this.xyzt_units);
        // cal_max, cal_min, slice_duration, toffset
        view.setFloat32(124, this.cal_max, this.littleEndian);
        view.setFloat32(128, this.cal_min, this.littleEndian);
        view.setFloat32(132, this.slice_duration, this.littleEndian);
        view.setFloat32(136, this.toffset, this.littleEndian);
        // glmax, glmin are unused
        // descrip and aux_file
        byteArray.set(new TextEncoder().encode(this.description), 148);
        byteArray.set(new TextEncoder().encode(this.aux_file), 228);
        // qform_code, sform_code
        view.setInt16(252, this.qform_code, this.littleEndian);
        view.setInt16(254, this.sform_code, this.littleEndian);
        // quatern_b, quatern_c, quatern_d, qoffset_x, qoffset_y, qoffset_z, srow_x[4], srow_y[4], and srow_z[4]
        view.setFloat32(256, this.quatern_b, this.littleEndian);
        view.setFloat32(260, this.quatern_c, this.littleEndian);
        view.setFloat32(264, this.quatern_d, this.littleEndian);
        view.setFloat32(268, this.qoffset_x, this.littleEndian);
        view.setFloat32(272, this.qoffset_y, this.littleEndian);
        view.setFloat32(276, this.qoffset_z, this.littleEndian);
        const flattened = this.affine.flat();
        // we only want the first three rows
        for (let i = 0; i < 12; i++) {
            view.setFloat32(280 + FLOAT32_SIZE * i, flattened[i], this.littleEndian);
        }
        // intent_name and magic
        byteArray.set(new TextEncoder().encode(this.intent_name), 328);
        byteArray.set(new TextEncoder().encode(this.magic), 344);
        // add our extension data
        if (includeExtensions) {
            byteArray.set(Uint8Array.from([1, 0, 0, 0]), 348);
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
            byteArray.set(new Uint8Array(4).fill(0), 348);
        }
        return byteArray.buffer;
    }
}
//# sourceMappingURL=nifti1.js.map