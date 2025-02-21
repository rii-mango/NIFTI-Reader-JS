import { decompressSync } from 'fflate';
import { NIFTI1 } from './nifti1.js';
import { NIFTI2 } from './nifti2.js';
import { Utils } from './utilities.js';
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
export function isNIFTI1(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    if (buf)
        mag1 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === NIFTI1.MAGIC_NUMBER2[0] &&
        mag2 === NIFTI1.MAGIC_NUMBER2[1] &&
        mag3 === NIFTI1.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === NIFTI1.MAGIC_NUMBER[0] && mag2 === NIFTI1.MAGIC_NUMBER[1] && mag3 === NIFTI1.MAGIC_NUMBER[2]);
}
/**
 * Returns true if this data represents a NIFTI-2 header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export function isNIFTI2(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
        return false;
    }
    buf = new DataView(data);
    mag1 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK &&
        mag1 === NIFTI2.MAGIC_NUMBER2[0] &&
        mag2 === NIFTI2.MAGIC_NUMBER2[1] &&
        mag3 === NIFTI2.MAGIC_NUMBER2[2])
        return true; // hdr/img pair
    return !!(mag1 === NIFTI2.MAGIC_NUMBER[0] && mag2 === NIFTI2.MAGIC_NUMBER[1] && mag3 === NIFTI2.MAGIC_NUMBER[2]);
}
/**
 * Returns true if this data represents a NIFTI header.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export function isNIFTI(data, isHdrImgPairOK = false) {
    return isNIFTI1(data, isHdrImgPairOK) || isNIFTI2(data, isHdrImgPairOK);
}
/**
 * Returns true if this data is GZIP compressed.
 * @param {ArrayBuffer} data
 * @returns {boolean}
 */
export function isCompressed(data) {
    var buf, magicCookie1, magicCookie2;
    if (data) {
        buf = new DataView(data);
        magicCookie1 = buf.getUint8(0);
        magicCookie2 = buf.getUint8(1);
        if (magicCookie1 === Utils.GUNZIP_MAGIC_COOKIE1) {
            return true;
        }
        if (magicCookie2 === Utils.GUNZIP_MAGIC_COOKIE2) {
            return true;
        }
    }
    return false;
}
/**
 * Returns decompressed data.
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export function decompress(data) {
    return decompressSync(new Uint8Array(data)).buffer;
}
/**
 * Returns promise of decompressed data.
 * @param {ArrayBuffer} data
 * @returns {Promise<ArrayBuffer>}
 */
export async function decompressAsync(data) {
    const uint8Data = new Uint8Array(data);
    const format = uint8Data[0] === 31 && uint8Data[1] === 139 && uint8Data[2] === 8
        ? 'gzip'
        : uint8Data[0] === 120 && (uint8Data[1] === 1 || uint8Data[1] === 94 || uint8Data[1] === 156 || uint8Data[1] === 218)
            ? 'deflate'
            : 'deflate-raw';
    const stream = new DecompressionStream(format);
    const writer = stream.writable.getWriter();
    writer.write(uint8Data).catch(console.error); // Do not await this
    // Close without awaiting directly, preventing the hang issue
    const closePromise = writer.close().catch(console.error);
    const response = new Response(stream.readable);
    const result = await response.arrayBuffer(); // Return ArrayBuffer instead of Uint8Array
    await closePromise; // Ensure close happens eventually
    return result;
}
/**
 * Returns promise of decompressed initial portion of data, reads at least minOutputBytes or entire file.
 * @param {ArrayBuffer} data
 * @param {number } minOutputBytes
 * @returns {Promise<ArrayBuffer>}
 */
export async function decompressHeaderAsync(data, minOutputBytes = Infinity) {
    // Utility function to detect compression format
    const detectFormat = (data) => {
        if (data[0] === 31 && data[1] === 139 && data[2] === 8)
            return 'gzip';
        if (data[0] === 120 && [1, 94, 156, 218].includes(data[1]))
            return 'deflate';
        return 'deflate-raw';
    };
    const uint8Data = new Uint8Array(data);
    const format = detectFormat(uint8Data);
    const stream = new DecompressionStream(format);
    // Create a TransformStream to limit the output size
    const limitStream = new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(chunk);
        },
        flush(controller) {
            controller.terminate();
        }
    });
    // Set up the pipeline
    const { readable, writable } = stream;
    const writer = writable.getWriter();
    const limitedReader = readable
        .pipeThrough(limitStream)
        .getReader();
    // Start the write operation
    writer.write(uint8Data).catch(err => {
        if (!(err instanceof Error && err.name === 'AbortError')) {
            console.error('Error during write:', err);
        }
    });
    const chunks = [];
    let totalBytes = 0;
    try {
        while (totalBytes < minOutputBytes) {
            const { done, value } = await limitedReader.read();
            if (done)
                break;
            const remainingSpace = minOutputBytes - totalBytes;
            const chunk = value.subarray(0, Math.min(value.length, remainingSpace));
            chunks.push(chunk);
            totalBytes += chunk.length;
            if (totalBytes >= minOutputBytes) {
                // Clean abort of all streams
                await Promise.all([
                    limitedReader.cancel().catch(() => { }),
                    writer.abort().catch(() => { })
                ]);
                break;
            }
        }
    }
    catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
            console.error('Error during decompression:', err);
        }
    }
    finally {
        await Promise.allSettled([
            limitedReader.cancel().catch(() => { }),
            writer.close().catch(() => { })
        ]);
    }
    // Combine chunks efficiently
    return chunks.length === 1
        ? chunks[0].buffer
        : chunks.reduce((acc, chunk) => {
            const combined = new Uint8Array(acc.byteLength + chunk.byteLength);
            combined.set(new Uint8Array(acc), 0);
            combined.set(chunk, acc.byteLength);
            return combined.buffer;
        }, new ArrayBuffer(0));
}
/**
 * Reads and returns the header object.
 * @param {ArrayBuffer} data
 * @returns {NIFTI1|NIFTI2}
 */
export function readHeader(data, isHdrImgPairOK = false) {
    let header = null;
    if (isCompressed(data)) {
        data = decompress(data);
    }
    if (isNIFTI1(data, isHdrImgPairOK)) {
        header = new NIFTI1();
    }
    else if (isNIFTI2(data, isHdrImgPairOK)) {
        header = new NIFTI2();
    }
    if (header) {
        header.readHeader(data);
    }
    else {
        throw new Error('That file does not appear to be NIFTI!');
    }
    return header;
}
export async function readHeaderAsync(data, isHdrImgPairOK = false) {
    if (!isCompressed(data)) {
        return readHeader(data, isHdrImgPairOK);
    }
    let header = null;
    let dat = await decompressHeaderAsync(data, 540);
    let isLitteEndian = true;
    let isVers1 = true;
    var rawData = new DataView(dat);
    const sigLittle = rawData.getInt32(0, true);
    const sigBig = rawData.getInt32(0, false);
    if (sigLittle === 348) {
        //little NIFTI1
    }
    else if (sigBig === 348) {
        isLitteEndian = false;
    }
    else if (sigLittle === 540) {
        isVers1 = false;
    }
    else if (sigBig === 540) {
        isVers1 = false;
        isLitteEndian = false;
    }
    else {
        throw new Error('That file does not appear to be NIFTI!');
    }
    let vox_offset = Math.round(rawData.getFloat32(108, isLitteEndian));
    if (NIFTI2) {
        vox_offset = Utils.getUint64At(rawData, 168, isLitteEndian);
    }
    if (vox_offset > dat.byteLength) {
        // it appears the header has extensions - make sure we have decompressed enough
        dat = await decompressHeaderAsync(data, vox_offset);
    }
    if (isVers1) {
        header = new NIFTI1();
    }
    else {
        header = new NIFTI2();
    }
    header.readHeader(dat);
    return header;
}
/**
 * Returns true if this header contains an extension.
 * @param {NIFTI1|NIFTI2} header
 * @returns {boolean}
 */
export function hasExtension(header) {
    return header.extensionFlag[0] != 0;
}
/**
 * Returns the image data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export function readImage(header, data) {
    var imageOffset = header.vox_offset, timeDim = 1, statDim = 1;
    if (header.dims[4]) {
        timeDim = header.dims[4];
    }
    if (header.dims[5]) {
        statDim = header.dims[5];
    }
    var imageSize = header.dims[1] * header.dims[2] * header.dims[3] * timeDim * statDim * (header.numBitsPerVoxel / 8);
    return data.slice(imageOffset, imageOffset + imageSize);
}
/**
 * Returns the extension data (including extension header).
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export function readExtension(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc, loc + size);
}
/**
 * Returns the extension data.
 * @param {NIFTI1|NIFTI2} header
 * @param {ArrayBuffer} data
 * @returns {ArrayBuffer}
 */
export function readExtensionData(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc + 8, loc + size); // +8 for loc and -8 for esize and ecode
}
//# sourceMappingURL=nifti.js.map