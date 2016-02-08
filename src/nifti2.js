
/*jslint browser: true, node: true */
/*global */

"use strict";

/*** Imports ***/

var nifti = nifti || {};
nifti.Utils = nifti.Utils || ((typeof require !== 'undefined') ? require('./utilities.js') : null);


/*** Constructor ***/
nifti.NIFTI2 = nifti.NIFTI2 || function () {
        this.littleEndian = false;
        this.dim_info = 0;
        this.dims = [];
        this.intent_p1 = 0;
        this.intent_p2 = 0;
        this.intent_p3 = 0;
        this.intent_code = 0;
        this.datatypeCode = 0;
        this.numBitsPerVoxel = 0;
        this.slice_start = 0;
        this.slice_end = 0;
        this.slice_code = 0;
        this.pixDims = [];
        this.vox_offset = 0;
        this.scl_slope = 1;
        this.scl_inter = 0;
        this.xyzt_units = 0;
        this.cal_max = 0;
        this.cal_min = 0;
        this.slice_duration = 0;
        this.toffset = 0;
        this.description = "";
        this.aux_file = "";
        this.intent_name = "";
        this.qform_code = 0;
        this.sform_code = 0;
        this.quatern_b = 0;
        this.quatern_c = 0;
        this.quatern_d = 0;
        this.qoffset_x = 0;
        this.qoffset_y = 0;
        this.qoffset_z = 0;
        this.affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.magic = 0;
    };



/*** Static Pseudo-constants ***/

nifti.NIFTI2.MAGIC_COOKIE = 540;
nifti.NIFTI2.MAGIC_NUMBER_LOCATION = 4;
nifti.NIFTI2.MAGIC_NUMBER = [0x6E, 0x2B, 0x32, 0, 0x0D, 0x0A, 0x1A, 0x0A];  // n+2\0



/*** Prototype Methods ***/

nifti.NIFTI2.prototype.readHeader = function (data) {
    var rawData = new DataView(data),
        magicCookieVal = nifti.Utils.getIntAt(rawData, 0, this.littleEndian),
        ctr,
        ctrOut,
        ctrIn,
        index,
        array;

    if (magicCookieVal !== nifti.NIFTI2.MAGIC_COOKIE) {  // try as little endian
        this.littleEndian = true;
        magicCookieVal = nifti.Utils.getIntAt(rawData, 0, this.littleEndian);
    }

    if (magicCookieVal !== nifti.NIFTI2.MAGIC_COOKIE) {
        throw new Error("This does not appear to be a NIFTI file!");
    }

    this.datatypeCode = nifti.Utils.getShortAt(rawData, 12, this.littleEndian);
    this.numBitsPerVoxel = nifti.Utils.getShortAt(rawData, 14, this.littleEndian);

    for (ctr = 0; ctr < 8; ctr += 1) {
        index = 16 + (ctr * 8);
        this.dims[ctr] = nifti.Utils.getLongAt(rawData, index, this.littleEndian);
    }

    this.intent_p1 = nifti.Utils.getDoubleAt(rawData, 80, this.littleEndian);
    this.intent_p2 = nifti.Utils.getDoubleAt(rawData, 88, this.littleEndian);
    this.intent_p3 = nifti.Utils.getDoubleAt(rawData, 96, this.littleEndian);

    for (ctr = 0; ctr < 8; ctr += 1) {
        index = 104 + (ctr * 8);
        this.pixDims[ctr] = nifti.Utils.getDoubleAt(rawData, index, this.littleEndian);
    }

    this.vox_offset = nifti.Utils.getLongAt(rawData, 168, this.littleEndian);

    this.scl_slope = nifti.Utils.getDoubleAt(rawData, 176, this.littleEndian);
    this.scl_inter = nifti.Utils.getDoubleAt(rawData, 184, this.littleEndian);

    this.cal_max = nifti.Utils.getDoubleAt(rawData, 192, this.littleEndian);
    this.cal_min = nifti.Utils.getDoubleAt(rawData, 200, this.littleEndian);

    this.slice_duration = nifti.Utils.getDoubleAt(rawData, 208, this.littleEndian);

    this.toffset = nifti.Utils.getDoubleAt(rawData, 216, this.littleEndian);

    this.slice_start = nifti.Utils.getLongAt(rawData, 224, this.littleEndian);
    this.slice_end = nifti.Utils.getLongAt(rawData, 232, this.littleEndian);

    this.description = nifti.Utils.getStringAt(rawData, 240, 240 + 80);
    this.aux_file = nifti.Utils.getStringAt(rawData, 320, 320 + 24);

    this.qform_code = nifti.Utils.getIntAt(rawData, 344, this.littleEndian);
    this.sform_code = nifti.Utils.getIntAt(rawData, 348, this.littleEndian);

    this.quatern_b = nifti.Utils.getDoubleAt(rawData, 352, this.littleEndian);
    this.quatern_c = nifti.Utils.getDoubleAt(rawData, 360, this.littleEndian);
    this.quatern_d = nifti.Utils.getDoubleAt(rawData, 368, this.littleEndian);
    this.qoffset_x = nifti.Utils.getDoubleAt(rawData, 376, this.littleEndian);
    this.qoffset_y = nifti.Utils.getDoubleAt(rawData, 384, this.littleEndian);
    this.qoffset_z = nifti.Utils.getDoubleAt(rawData, 392, this.littleEndian);

    for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
        for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
            index = 400 + (((ctrOut * 8) + ctrIn) * 8);
            this.affine[ctrOut][ctrIn] = nifti.Utils.getDoubleAt(rawData, index, this.littleEndian);
        }
    }

    this.affine[3][0] = 0;
    this.affine[3][1] = 0;
    this.affine[3][2] = 0;
    this.affine[3][3] = 1;

    this.slice_code = nifti.Utils.getIntAt(rawData, 496, this.littleEndian);
    this.xyzt_units = nifti.Utils.getIntAt(rawData, 500, this.littleEndian);
    this.intent_code = nifti.Utils.getIntAt(rawData, 504, this.littleEndian);
    this.intent_name = nifti.Utils.getStringAt(rawData, 508, 508 + 16);

    this.dim_info = nifti.Utils.getByteAt(rawData, 524);
};



nifti.NIFTI2.prototype.getQformMat = function () {
    return nifti.convertNiftiQFormToNiftiSForm(this.quatern_b, this.quatern_c, this.quatern_d, this.qoffset_x,
        this.qoffset_y, this.qoffset_z, this.pixDims[1], this.pixDims[2], this.pixDims[3], this.pixDims[0]);
};



/*** Exports ***/

var moduleType = typeof module;
if ((moduleType !== 'undefined') && module.exports) {
    module.exports = nifti.NIFTI2;
}
