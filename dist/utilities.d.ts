import { NIFTIEXTENSION } from './nifti-extension.js';
type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare class Utils {
    /*** Static Pseudo-constants ***/
    static crcTable: number[] | null;
    static readonly GUNZIP_MAGIC_COOKIE1 = 31;
    static readonly GUNZIP_MAGIC_COOKIE2 = 139;
    /*** Static methods ***/
    static getStringAt(data: DataView, start: number, end: number): string;
    static getByteAt: (data: DataView, start: number) => number;
    static getShortAt: (data: DataView, start: number, littleEndian: boolean) => number;
    static getIntAt(data: DataView, start: number, littleEndian: boolean): number;
    static getFloatAt(data: DataView, start: number, littleEndian: boolean): number;
    static getDoubleAt(data: DataView, start: number, littleEndian: boolean): number;
    static getInt64At(dataView: DataView, index: number, littleEndian: boolean): number;
    static getUint64At(dataView: DataView, index: number, littleEndian: boolean): number;
    static getExtensionsAt(data: DataView, start: number, littleEndian: boolean, voxOffset: number): NIFTIEXTENSION[];
    static toArrayBuffer(buffer: TypedArray): ArrayBuffer;
    static isString(obj: Object): boolean;
    static formatNumber(num: any, shortFormat?: boolean | undefined): number;
    static makeCRCTable(): number[];
    static crc32(dataView: DataView): number;
}
export {};
//# sourceMappingURL=utilities.d.ts.map