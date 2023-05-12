"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExtensionData = exports.readExtension = exports.readImage = exports.hasExtension = exports.readHeader = exports.decompress = exports.isCompressed = exports.isNIFTI = exports.isNIFTI2 = exports.isNIFTI1 = exports.NIFTIEXTENSION = exports.Utils = exports.NIFTI2 = exports.NIFTI1 = void 0;
const fflate = __importStar(require("fflate"));
const nifti1_1 = require("./nifti1");
const nifti2_1 = require("./nifti2");
const utilities_1 = require("./utilities");
var nifti1_2 = require("./nifti1");
Object.defineProperty(exports, "NIFTI1", { enumerable: true, get: function () { return nifti1_2.NIFTI1; } });
var nifti2_2 = require("./nifti2");
Object.defineProperty(exports, "NIFTI2", { enumerable: true, get: function () { return nifti2_2.NIFTI2; } });
var utilities_2 = require("./utilities");
Object.defineProperty(exports, "Utils", { enumerable: true, get: function () { return utilities_2.Utils; } });
var nifti_extension_1 = require("./nifti-extension");
Object.defineProperty(exports, "NIFTIEXTENSION", { enumerable: true, get: function () { return nifti_extension_1.NIFTIEXTENSION; } });
/*** Static Methods ***/
/**
 * Returns true if this data represents a NIFTI-1 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI1(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < nifti1_1.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    if (buf)
        mag1 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti1_1.NIFTI1.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER2[0] &&
        mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER2[1] &&
        mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER[0] &&
        mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER[1] &&
        mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER[2]);
}
exports.isNIFTI1 = isNIFTI1;
/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI2(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < nifti1_1.NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    mag1 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER2[0] &&
        mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER2[1] &&
        mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER[0] &&
        mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER[1] &&
        mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER[2]);
}
exports.isNIFTI2 = isNIFTI2;
/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isNIFTI(data, isHdrImgPairOK = false) {
    return (isNIFTI1(data, isHdrImgPairOK) ||
        isNIFTI2(data, isHdrImgPairOK));
}
exports.isNIFTI = isNIFTI;
/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
function isCompressed(data) {
    var buf, magicCookie1, magicCookie2;
    if (data) {
        buf = new DataView(data);
        magicCookie1 = buf.getUint8(0);
        magicCookie2 = buf.getUint8(1);
        if (magicCookie1 === utilities_1.Utils.GUNZIP_MAGIC_COOKIE1) {
            return true;
        }
        if (magicCookie2 === utilities_1.Utils.GUNZIP_MAGIC_COOKIE2) {
            return true;
        }
    }
    return false;
}
exports.isCompressed = isCompressed;
/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function decompress(data) {
    return fflate.decompressSync(new Uint8Array(data)).buffer;
}
exports.decompress = decompress;
/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {NIFTI1|NIFTI2|null}
 */
function readHeader(data, isHdrImgPairOK = false) {
    var header = null;
    if (isCompressed(data)) {
        data = decompress(data);
    }
    if (isNIFTI1(data, isHdrImgPairOK)) {
        header = new nifti1_1.NIFTI1();
    }
    else if (isNIFTI2(data, isHdrImgPairOK)) {
        header = new nifti2_1.NIFTI2();
    }
    if (header) {
        header.readHeader(data);
    }
    else {
        console.error("That file does not appear to be NIFTI!");
    }
    return header;
}
exports.readHeader = readHeader;
/**
 * Returns true if this header contains an extension.
 * @param {NIFTI1|NIFTI2} header
 * @returns {boolean}
 */
function hasExtension(header) {
    return header.extensionFlag[0] != 0;
}
exports.hasExtension = hasExtension;
/**
 * Returns the image data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readImage(header, data) {
    var imageOffset = header.vox_offset, timeDim = 1, statDim = 1;
    if (header.dims[4]) {
        timeDim = header.dims[4];
    }
    if (header.dims[5]) {
        statDim = header.dims[5];
    }
    var imageSize = header.dims[1] *
        header.dims[2] *
        header.dims[3] *
        timeDim *
        statDim *
        (header.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
}
exports.readImage = readImage;
/**
 * Returns the extension data (including extension header).
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readExtension(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc, loc + size);
}
exports.readExtension = readExtension;
/**
 * Returns the extension data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
function readExtensionData(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc + 8, loc + size); // +8 for loc and -8 for esize and ecode
}
exports.readExtensionData = readExtensionData;
//# sourceMappingURL=nifti.js.map