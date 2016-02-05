
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
        index;

    if (magicCookieVal !== nifti.NIFTI2.MAGIC_COOKIE) {  // try as little endian
        this.littleEndian = true;
        magicCookieVal = nifti.Utils.getIntAt(rawData, 0, this.littleEndian);
    }

    if (magicCookieVal !== nifti.NIFTI2.MAGIC_COOKIE) {
        throw new Error("This does not appear to be a NIFTI file!");
    }
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
