"use strict";
(() => {
  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var u32 = Uint32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
      b[i] = start += 1 << eb[i - 1];
    }
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
      for (var j = b[i]; j < b[i + 1]; ++j) {
        r[j] = j - b[i] << 5 | i;
      }
    }
    return [b, r];
  };
  var _a = freb(fleb, 2);
  var fl = _a[0];
  var revfl = _a[1];
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b[0];
  var revfd = _b[1];
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >>> 1 | (i & 21845) << 1;
    x = (x & 52428) >>> 2 | (x & 13107) << 2;
    x = (x & 61680) >>> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
  }
  var x;
  var i;
  var hMap = function(cd, mb, r) {
    var s = cd.length;
    var i = 0;
    var l = new u16(mb);
    for (; i < s; ++i) {
      if (cd[i])
        ++l[cd[i] - 1];
    }
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
      le[i] = le[i - 1] + l[i - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          var sv = i << 4 | cd[i];
          var r_1 = mb - cd[i];
          var v = le[cd[i] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >>> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i = 0; i < s; ++i) {
        if (cd[i]) {
          co[i] = rev[le[cd[i] - 1]++] >>> 15 - cd[i];
        }
      }
    }
    return co;
  };
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
      if (a[i] > m)
        m = a[i];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, buf, st) {
    var sl = dat.length;
    if (!sl || st && st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf || st;
    var noSt = !st || st.i;
    if (!st)
      st = {};
    if (!buf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (noBuf)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i = 0; i < hcLen; ++i) {
            clt[clim[i]] = bits(dat, pos + i * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i = 0; i < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >>> 4;
            if (s < 16) {
              ldt[i++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (noBuf)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i = sym - 257, b = fleb[i];
            add = bits(dat, pos, (1 << b) - 1) + fl[i];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (noBuf)
            cbuf(bt + 131072);
          var end = bt + add;
          for (; bt < end; bt += 4) {
            buf[bt] = buf[bt - dt];
            buf[bt + 1] = buf[bt + 1 - dt];
            buf[bt + 2] = buf[bt + 2 - dt];
            buf[bt + 3] = buf[bt + 3 - dt];
          }
          bt = end;
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var gzs = function(d) {
    if (d[0] != 31 || d[1] != 139 || d[2] != 8)
      err(6, "invalid gzip data");
    var flg = d[3];
    var st = 10;
    if (flg & 4)
      st += d[10] | (d[11] << 8) + 2;
    for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
      ;
    return st + (flg & 2);
  };
  var gzl = function(d) {
    var l = d.length;
    return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
  };
  var zlv = function(d) {
    if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31)
      err(6, "invalid zlib data");
    if (d[1] & 32)
      err(6, "invalid zlib data: preset dictionaries not supported");
  };
  function inflateSync(data, out) {
    return inflt(data, out);
  }
  function gunzipSync(data, out) {
    return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
  }
  function unzlibSync(data, out) {
    return inflt((zlv(data), data.subarray(2, -4)), out);
  }
  function decompressSync(data, out) {
    return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, out) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, out) : unzlibSync(data, out);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }

  // dist/src/nifti-extension.js
  var NIFTIEXTENSION = class {
    esize;
    ecode;
    edata;
    littleEndian;
    constructor(esize, ecode, edata, littleEndian) {
      if (esize % 16 != 0) {
        throw new Error("This does not appear to be a NIFTI extension");
      }
      this.esize = esize;
      this.ecode = ecode;
      this.edata = edata;
      this.littleEndian = littleEndian;
    }
    /**
     * Returns extension as ArrayBuffer.
     * @returns {ArrayBuffer}
     */
    toArrayBuffer() {
      let byteArray = new Uint8Array(this.esize);
      let data = new Uint8Array(this.edata);
      byteArray.set(data, 8);
      let view = new DataView(byteArray.buffer);
      view.setInt32(0, this.esize, this.littleEndian);
      view.setInt32(4, this.ecode, this.littleEndian);
      return byteArray.buffer;
    }
  };

  // dist/src/utilities.js
  var Utils = class _Utils {
    /*** Static Pseudo-constants ***/
    static crcTable = null;
    static GUNZIP_MAGIC_COOKIE1 = 31;
    static GUNZIP_MAGIC_COOKIE2 = 139;
    /*** Static methods ***/
    static getStringAt(data, start, end) {
      var str = "", ctr, ch;
      for (ctr = start; ctr < end; ctr += 1) {
        ch = data.getUint8(ctr);
        if (ch !== 0) {
          str += String.fromCharCode(ch);
        }
      }
      return str;
    }
    static getByteAt = function(data, start) {
      return data.getUint8(start);
    };
    static getShortAt = function(data, start, littleEndian) {
      return data.getInt16(start, littleEndian);
    };
    static getIntAt(data, start, littleEndian) {
      return data.getInt32(start, littleEndian);
    }
    static getFloatAt(data, start, littleEndian) {
      return data.getFloat32(start, littleEndian);
    }
    static getDoubleAt(data, start, littleEndian) {
      return data.getFloat64(start, littleEndian);
    }
    static getInt64At(dataView, index, littleEndian) {
      const low = dataView.getUint32(index, littleEndian);
      const high = dataView.getInt32(index + 4, littleEndian);
      let result;
      if (littleEndian) {
        result = high * 2 ** 32 + low;
      } else {
        result = low * 2 ** 32 + high;
      }
      if (high < 0) {
        result += -1 * 2 ** 32 * 2 ** 32;
      }
      return result;
    }
    static getExtensionsAt(data, start, littleEndian, voxOffset) {
      let extensions = [];
      let extensionByteIndex = start;
      while (extensionByteIndex < voxOffset) {
        let extensionLittleEndian = littleEndian;
        let esize = _Utils.getIntAt(data, extensionByteIndex, littleEndian);
        if (!esize) {
          break;
        }
        if (esize + extensionByteIndex > voxOffset) {
          extensionLittleEndian = !extensionLittleEndian;
          esize = _Utils.getIntAt(data, extensionByteIndex, extensionLittleEndian);
          if (esize + extensionByteIndex > voxOffset) {
            throw new Error("This does not appear to be a valid NIFTI extension");
          }
        }
        if (esize % 16 != 0) {
          throw new Error("This does not appear to be a NIFTI extension");
        }
        let ecode = _Utils.getIntAt(data, extensionByteIndex + 4, extensionLittleEndian);
        let edata = data.buffer.slice(extensionByteIndex + 8, extensionByteIndex + esize);
        let extension = new NIFTIEXTENSION(esize, ecode, edata, extensionLittleEndian);
        extensions.push(extension);
        extensionByteIndex += esize;
      }
      return extensions;
    }
    static toArrayBuffer(buffer) {
      var ab, view, i;
      ab = new ArrayBuffer(buffer.length);
      view = new Uint8Array(ab);
      for (i = 0; i < buffer.length; i += 1) {
        view[i] = buffer[i];
      }
      return ab;
    }
    static isString(obj) {
      return typeof obj === "string" || obj instanceof String;
    }
    static formatNumber(num, shortFormat = void 0) {
      let val;
      if (_Utils.isString(num)) {
        val = Number(num);
      } else {
        val = num;
      }
      if (shortFormat) {
        val = val.toPrecision(5);
      } else {
        val = val.toPrecision(7);
      }
      return parseFloat(val);
    }
    // http://stackoverflow.com/questions/18638900/javascript-crc32
    static makeCRCTable() {
      let c;
      let crcTable = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        crcTable[n] = c;
      }
      return crcTable;
    }
    static crc32(dataView) {
      if (!_Utils.crcTable) {
        _Utils.crcTable = _Utils.makeCRCTable();
      }
      const crcTable = _Utils.crcTable;
      let crc = 0 ^ -1;
      for (var i = 0; i < dataView.byteLength; i++) {
        crc = crc >>> 8 ^ crcTable[(crc ^ dataView.getUint8(i)) & 255];
      }
      return (crc ^ -1) >>> 0;
    }
  };

  // dist/src/nifti1.js
  var NIFTI1 = class _NIFTI1 {
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
    description = "";
    aux_file = "";
    intent_name = "";
    qform_code = 0;
    sform_code = 0;
    quatern_a = 0;
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
    qfac = 1;
    quatern_R;
    magic = "0";
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
    static SPATIAL_UNITS_MASK = 7;
    static TEMPORAL_UNITS_MASK = 56;
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
    static MAGIC_NUMBER = [110, 43, 49];
    // n+1 (.nii)
    static MAGIC_NUMBER2 = [110, 105, 49];
    // ni1 (.hdr/.img)
    static EXTENSION_HEADER_SIZE = 8;
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
      var rawData = new DataView(data), magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index;
      if (magicCookieVal !== _NIFTI1.MAGIC_COOKIE) {
        this.littleEndian = true;
        magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian);
      }
      if (magicCookieVal !== _NIFTI1.MAGIC_COOKIE) {
        throw new Error("This does not appear to be a NIFTI file!");
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
      this.quatern_a = Math.sqrt(1 - (Math.pow(this.quatern_b, 2) + Math.pow(this.quatern_c, 2) + Math.pow(this.quatern_d, 2)));
      this.qoffset_x = Utils.getFloatAt(rawData, 268, this.littleEndian);
      this.qoffset_y = Utils.getFloatAt(rawData, 272, this.littleEndian);
      this.qoffset_z = Utils.getFloatAt(rawData, 276, this.littleEndian);
      if (this.qform_code < 1 && this.sform_code < 1) {
        this.affine[0][0] = this.pixDims[1];
        this.affine[1][1] = this.pixDims[2];
        this.affine[2][2] = this.pixDims[3];
      }
      if (this.qform_code > 0 && this.sform_code < this.qform_code) {
        const a = this.quatern_a;
        const b = this.quatern_b;
        const c = this.quatern_c;
        const d = this.quatern_d;
        this.qfac = this.pixDims[0] === 0 ? 1 : this.pixDims[0];
        this.quatern_R = [
          [
            a * a + b * b - c * c - d * d,
            2 * b * c - 2 * a * d,
            2 * b * d + 2 * a * c
          ],
          [
            2 * b * c + 2 * a * d,
            a * a + c * c - b * b - d * d,
            2 * c * d - 2 * a * b
          ],
          [
            2 * b * d - 2 * a * c,
            2 * c * d + 2 * a * b,
            a * a + d * d - c * c - b * b
          ]
        ];
        for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
          for (ctrIn = 0; ctrIn < 3; ctrIn += 1) {
            this.affine[ctrOut][ctrIn] = this.quatern_R[ctrOut][ctrIn] * this.pixDims[ctrIn + 1];
            if (ctrIn === 2) {
              this.affine[ctrOut][ctrIn] *= this.qfac;
            }
          }
        }
        this.affine[0][3] = this.qoffset_x;
        this.affine[1][3] = this.qoffset_y;
        this.affine[2][3] = this.qoffset_z;
      } else if (this.sform_code > 0) {
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
      this.isHDR = this.magic === String.fromCharCode.apply(null, _NIFTI1.MAGIC_NUMBER2);
      if (rawData.byteLength > _NIFTI1.MAGIC_COOKIE) {
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
          this.extensions = Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
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
      var fmt = Utils.formatNumber, string = "";
      string += "Dim Info = " + this.dim_info + "\n";
      string += "Image Dimensions (1-8): " + this.dims[0] + ", " + this.dims[1] + ", " + this.dims[2] + ", " + this.dims[3] + ", " + this.dims[4] + ", " + this.dims[5] + ", " + this.dims[6] + ", " + this.dims[7] + "\n";
      string += "Intent Parameters (1-3): " + this.intent_p1 + ", " + this.intent_p2 + ", " + this.intent_p3 + "\n";
      string += "Intent Code = " + this.intent_code + "\n";
      string += "Datatype = " + this.datatypeCode + " (" + this.getDatatypeCodeString(this.datatypeCode) + ")\n";
      string += "Bits Per Voxel = " + this.numBitsPerVoxel + "\n";
      string += "Slice Start = " + this.slice_start + "\n";
      string += "Voxel Dimensions (1-8): " + fmt(this.pixDims[0]) + ", " + fmt(this.pixDims[1]) + ", " + fmt(this.pixDims[2]) + ", " + fmt(this.pixDims[3]) + ", " + fmt(this.pixDims[4]) + ", " + fmt(this.pixDims[5]) + ", " + fmt(this.pixDims[6]) + ", " + fmt(this.pixDims[7]) + "\n";
      string += "Image Offset = " + this.vox_offset + "\n";
      string += "Data Scale:  Slope = " + fmt(this.scl_slope) + "  Intercept = " + fmt(this.scl_inter) + "\n";
      string += "Slice End = " + this.slice_end + "\n";
      string += "Slice Code = " + this.slice_code + "\n";
      string += "Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(_NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(_NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ")\n";
      string += "Display Range:  Max = " + fmt(this.cal_max) + "  Min = " + fmt(this.cal_min) + "\n";
      string += "Slice Duration = " + this.slice_duration + "\n";
      string += "Time Axis Shift = " + this.toffset + "\n";
      string += 'Description: "' + this.description + '"\n';
      string += 'Auxiliary File: "' + this.aux_file + '"\n';
      string += "Q-Form Code = " + this.qform_code + " (" + this.getTransformCodeString(this.qform_code) + ")\n";
      string += "S-Form Code = " + this.sform_code + " (" + this.getTransformCodeString(this.sform_code) + ")\n";
      string += "Quaternion Parameters:  b = " + fmt(this.quatern_b) + "  c = " + fmt(this.quatern_c) + "  d = " + fmt(this.quatern_d) + "\n";
      string += "Quaternion Offsets:  x = " + this.qoffset_x + "  y = " + this.qoffset_y + "  z = " + this.qoffset_z + "\n";
      string += "S-Form Parameters X: " + fmt(this.affine[0][0]) + ", " + fmt(this.affine[0][1]) + ", " + fmt(this.affine[0][2]) + ", " + fmt(this.affine[0][3]) + "\n";
      string += "S-Form Parameters Y: " + fmt(this.affine[1][0]) + ", " + fmt(this.affine[1][1]) + ", " + fmt(this.affine[1][2]) + ", " + fmt(this.affine[1][3]) + "\n";
      string += "S-Form Parameters Z: " + fmt(this.affine[2][0]) + ", " + fmt(this.affine[2][1]) + ", " + fmt(this.affine[2][2]) + ", " + fmt(this.affine[2][3]) + "\n";
      string += 'Intent Name: "' + this.intent_name + '"\n';
      if (this.extensionFlag[0]) {
        string += "Extension: Size = " + this.extensionSize + "  Code = " + this.extensionCode + "\n";
      }
      return string;
    }
    /**
     * Returns a human-readable string of datatype.
     * @param {number} code
     * @returns {string}
     */
    getDatatypeCodeString = function(code) {
      if (code === _NIFTI1.TYPE_UINT8) {
        return "1-Byte Unsigned Integer";
      } else if (code === _NIFTI1.TYPE_INT16) {
        return "2-Byte Signed Integer";
      } else if (code === _NIFTI1.TYPE_INT32) {
        return "4-Byte Signed Integer";
      } else if (code === _NIFTI1.TYPE_FLOAT32) {
        return "4-Byte Float";
      } else if (code === _NIFTI1.TYPE_FLOAT64) {
        return "8-Byte Float";
      } else if (code === _NIFTI1.TYPE_RGB24) {
        return "RGB";
      } else if (code === _NIFTI1.TYPE_INT8) {
        return "1-Byte Signed Integer";
      } else if (code === _NIFTI1.TYPE_UINT16) {
        return "2-Byte Unsigned Integer";
      } else if (code === _NIFTI1.TYPE_UINT32) {
        return "4-Byte Unsigned Integer";
      } else if (code === _NIFTI1.TYPE_INT64) {
        return "8-Byte Signed Integer";
      } else if (code === _NIFTI1.TYPE_UINT64) {
        return "8-Byte Unsigned Integer";
      } else {
        return "Unknown";
      }
    };
    /**
     * Returns a human-readable string of transform type.
     * @param {number} code
     * @returns {string}
     */
    getTransformCodeString = function(code) {
      if (code === _NIFTI1.XFORM_SCANNER_ANAT) {
        return "Scanner";
      } else if (code === _NIFTI1.XFORM_ALIGNED_ANAT) {
        return "Aligned";
      } else if (code === _NIFTI1.XFORM_TALAIRACH) {
        return "Talairach";
      } else if (code === _NIFTI1.XFORM_MNI_152) {
        return "MNI";
      } else {
        return "Unknown";
      }
    };
    /**
     * Returns a human-readable string of spatial and temporal units.
     * @param {number} code
     * @returns {string}
     */
    getUnitsCodeString = function(code) {
      if (code === _NIFTI1.UNITS_METER) {
        return "Meters";
      } else if (code === _NIFTI1.UNITS_MM) {
        return "Millimeters";
      } else if (code === _NIFTI1.UNITS_MICRON) {
        return "Microns";
      } else if (code === _NIFTI1.UNITS_SEC) {
        return "Seconds";
      } else if (code === _NIFTI1.UNITS_MSEC) {
        return "Milliseconds";
      } else if (code === _NIFTI1.UNITS_USEC) {
        return "Microseconds";
      } else if (code === _NIFTI1.UNITS_HZ) {
        return "Hz";
      } else if (code === _NIFTI1.UNITS_PPM) {
        return "PPM";
      } else if (code === _NIFTI1.UNITS_RADS) {
        return "Rads";
      } else {
        return "Unknown";
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
      R[3][0] = R[3][1] = R[3][2] = 0;
      R[3][3] = 1;
      a = 1 - (b * b + c * c + d * d);
      if (a < 1e-7) {
        a = 1 / Math.sqrt(b * b + c * c + d * d);
        b *= a;
        c *= a;
        d *= a;
        a = 0;
      } else {
        a = Math.sqrt(a);
      }
      xd = dx > 0 ? dx : 1;
      yd = dy > 0 ? dy : 1;
      zd = dz > 0 ? dz : 1;
      if (qfac < 0) {
        zd = -zd;
      }
      R[0][0] = (a * a + b * b - c * c - d * d) * xd;
      R[0][1] = 2 * (b * c - a * d) * yd;
      R[0][2] = 2 * (b * d + a * c) * zd;
      R[1][0] = 2 * (b * c + a * d) * xd;
      R[1][1] = (a * a + c * c - b * b - d * d) * yd;
      R[1][2] = 2 * (c * d - a * b) * zd;
      R[2][0] = 2 * (b * d - a * c) * xd;
      R[2][1] = 2 * (c * d + a * b) * yd;
      R[2][2] = (a * a + d * d - c * c - b * b) * zd;
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
      xi = R[0][0];
      xj = R[0][1];
      xk = R[0][2];
      yi = R[1][0];
      yj = R[1][1];
      yk = R[1][2];
      zi = R[2][0];
      zj = R[2][1];
      zk = R[2][2];
      val = Math.sqrt(xi * xi + yi * yi + zi * zi);
      if (val === 0) {
        return null;
      }
      xi /= val;
      yi /= val;
      zi /= val;
      val = Math.sqrt(xj * xj + yj * yj + zj * zj);
      if (val === 0) {
        return null;
      }
      xj /= val;
      yj /= val;
      zj /= val;
      val = xi * xj + yi * yj + zi * zj;
      if (Math.abs(val) > 1e-4) {
        xj -= val * xi;
        yj -= val * yi;
        zj -= val * zi;
        val = Math.sqrt(xj * xj + yj * yj + zj * zj);
        if (val === 0) {
          return null;
        }
        xj /= val;
        yj /= val;
        zj /= val;
      }
      val = Math.sqrt(xk * xk + yk * yk + zk * zk);
      if (val === 0) {
        xk = yi * zj - zi * yj;
        yk = zi * xj - zj * xi;
        zk = xi * yj - yi * xj;
      } else {
        xk /= val;
        yk /= val;
        zk /= val;
      }
      val = xi * xk + yi * yk + zi * zk;
      if (Math.abs(val) > 1e-4) {
        xk -= val * xi;
        yk -= val * yi;
        zk -= val * zi;
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0) {
          return null;
        }
        xk /= val;
        yk /= val;
        zk /= val;
      }
      val = xj * xk + yj * yk + zj * zk;
      if (Math.abs(val) > 1e-4) {
        xk -= val * xj;
        yk -= val * yj;
        zk -= val * zj;
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0) {
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
      detQ = this.nifti_mat33_determ(Q);
      if (detQ === 0) {
        return null;
      }
      vbest = -666;
      ibest = pbest = qbest = rbest = 1;
      jbest = 2;
      kbest = 3;
      for (i = 1; i <= 3; i += 1) {
        for (j = 1; j <= 3; j += 1) {
          if (i !== j) {
            for (k = 1; k <= 3; k += 1) {
              if (!(i === k || j === k)) {
                P[0][0] = P[0][1] = P[0][2] = P[1][0] = P[1][1] = P[1][2] = P[2][0] = P[2][1] = P[2][2] = 0;
                for (p = -1; p <= 1; p += 2) {
                  for (q = -1; q <= 1; q += 2) {
                    for (r = -1; r <= 1; r += 2) {
                      P[0][i - 1] = p;
                      P[1][j - 1] = q;
                      P[2][k - 1] = r;
                      detP = this.nifti_mat33_determ(P);
                      if (detP * detQ > 0) {
                        M = this.nifti_mat33_mul(P, Q);
                        val = M[0][0] + M[1][1] + M[2][2];
                        if (val > vbest) {
                          vbest = val;
                          ibest = i;
                          jbest = j;
                          kbest = k;
                          pbest = p;
                          qbest = q;
                          rbest = r;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      iChar = jChar = kChar = iSense = jSense = kSense = "";
      switch (ibest * pbest) {
        case 1:
          iChar = "X";
          iSense = "+";
          break;
        case -1:
          iChar = "X";
          iSense = "-";
          break;
        case 2:
          iChar = "Y";
          iSense = "+";
          break;
        case -2:
          iChar = "Y";
          iSense = "-";
          break;
        case 3:
          iChar = "Z";
          iSense = "+";
          break;
        case -3:
          iChar = "Z";
          iSense = "-";
          break;
      }
      switch (jbest * qbest) {
        case 1:
          jChar = "X";
          jSense = "+";
          break;
        case -1:
          jChar = "X";
          jSense = "-";
          break;
        case 2:
          jChar = "Y";
          jSense = "+";
          break;
        case -2:
          jChar = "Y";
          jSense = "-";
          break;
        case 3:
          jChar = "Z";
          jSense = "+";
          break;
        case -3:
          jChar = "Z";
          jSense = "-";
          break;
      }
      switch (kbest * rbest) {
        case 1:
          kChar = "X";
          kSense = "+";
          break;
        case -1:
          kChar = "X";
          kSense = "-";
          break;
        case 2:
          kChar = "Y";
          kSense = "+";
          break;
        case -2:
          kChar = "Y";
          kSense = "-";
          break;
        case 3:
          kChar = "Z";
          kSense = "+";
          break;
        case -3:
          kChar = "Z";
          kSense = "-";
          break;
      }
      return iChar + jChar + kChar + iSense + jSense + kSense;
    }
    nifti_mat33_mul = function(A, B) {
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
    nifti_mat33_determ = function(R) {
      var r11, r12, r13, r21, r22, r23, r31, r32, r33;
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
      return _NIFTI1.MAGIC_COOKIE + 4;
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
      } else {
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
      let byteSize = 348 + 4;
      if (includeExtensions) {
        for (let extension of this.extensions) {
          byteSize += extension.esize;
        }
      }
      let byteArray = new Uint8Array(byteSize);
      let view = new DataView(byteArray.buffer);
      view.setInt32(0, 348, this.littleEndian);
      view.setUint8(39, this.dim_info);
      for (let i = 0; i < 8; i++) {
        view.setUint16(40 + SHORT_SIZE * i, this.dims[i], this.littleEndian);
      }
      view.setFloat32(56, this.intent_p1, this.littleEndian);
      view.setFloat32(60, this.intent_p2, this.littleEndian);
      view.setFloat32(64, this.intent_p3, this.littleEndian);
      view.setInt16(68, this.intent_code, this.littleEndian);
      view.setInt16(70, this.datatypeCode, this.littleEndian);
      view.setInt16(72, this.numBitsPerVoxel, this.littleEndian);
      view.setInt16(74, this.slice_start, this.littleEndian);
      for (let i = 0; i < 8; i++) {
        view.setFloat32(76 + FLOAT32_SIZE * i, this.pixDims[i], this.littleEndian);
      }
      view.setFloat32(108, this.vox_offset, this.littleEndian);
      view.setFloat32(112, this.scl_slope, this.littleEndian);
      view.setFloat32(116, this.scl_inter, this.littleEndian);
      view.setInt16(120, this.slice_end, this.littleEndian);
      view.setUint8(122, this.slice_code);
      view.setUint8(123, this.xyzt_units);
      view.setFloat32(124, this.cal_max, this.littleEndian);
      view.setFloat32(128, this.cal_min, this.littleEndian);
      view.setFloat32(132, this.slice_duration, this.littleEndian);
      view.setFloat32(136, this.toffset, this.littleEndian);
      byteArray.set(new TextEncoder().encode(this.description), 148);
      byteArray.set(new TextEncoder().encode(this.aux_file), 228);
      view.setInt16(252, this.qform_code, this.littleEndian);
      view.setInt16(254, this.sform_code, this.littleEndian);
      view.setFloat32(256, this.quatern_b, this.littleEndian);
      view.setFloat32(260, this.quatern_c, this.littleEndian);
      view.setFloat32(264, this.quatern_d, this.littleEndian);
      view.setFloat32(268, this.qoffset_x, this.littleEndian);
      view.setFloat32(272, this.qoffset_y, this.littleEndian);
      view.setFloat32(276, this.qoffset_z, this.littleEndian);
      const flattened = this.affine.flat();
      for (let i = 0; i < 12; i++) {
        view.setFloat32(280 + FLOAT32_SIZE * i, flattened[i], this.littleEndian);
      }
      byteArray.set(new TextEncoder().encode(this.intent_name), 328);
      byteArray.set(new TextEncoder().encode(this.magic), 344);
      if (includeExtensions) {
        byteArray.set(Uint8Array.from([1, 0, 0, 0]), 348);
        let extensionByteIndex = this.getExtensionLocation();
        for (const extension of this.extensions) {
          view.setInt32(extensionByteIndex, extension.esize, extension.littleEndian);
          view.setInt32(extensionByteIndex + 4, extension.ecode, extension.littleEndian);
          byteArray.set(new Uint8Array(extension.edata), extensionByteIndex + 8);
          extensionByteIndex += extension.esize;
        }
      } else {
        byteArray.set(new Uint8Array(4).fill(0), 348);
      }
      return byteArray.buffer;
    }
  };

  // dist/src/nifti2.js
  var NIFTI2 = class _NIFTI2 {
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
    description = "";
    aux_file = "";
    intent_name = "";
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
    magic = "0";
    extensionFlag = [0, 0, 0, 0];
    extensions = [];
    extensionSize = 0;
    extensionCode = 0;
    /*** Static Pseudo-constants ***/
    static MAGIC_COOKIE = 540;
    static MAGIC_NUMBER_LOCATION = 4;
    static MAGIC_NUMBER = [
      110,
      43,
      50,
      0,
      13,
      10,
      26,
      10
    ];
    // n+2\0
    static MAGIC_NUMBER2 = [
      110,
      105,
      50,
      0,
      13,
      10,
      26,
      10
    ];
    // ni2\0
    /*** Prototype Methods ***/
    /**
     * Reads the header data.
     * @param {ArrayBuffer} data
     */
    readHeader(data) {
      var rawData = new DataView(data), magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index, array;
      if (magicCookieVal !== _NIFTI2.MAGIC_COOKIE) {
        this.littleEndian = true;
        magicCookieVal = Utils.getIntAt(rawData, 0, this.littleEndian);
      }
      if (magicCookieVal !== _NIFTI2.MAGIC_COOKIE) {
        throw new Error("This does not appear to be a NIFTI file!");
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
      if (rawData.byteLength > _NIFTI2.MAGIC_COOKIE) {
        this.extensionFlag[0] = Utils.getByteAt(rawData, 540);
        this.extensionFlag[1] = Utils.getByteAt(rawData, 540 + 1);
        this.extensionFlag[2] = Utils.getByteAt(rawData, 540 + 2);
        this.extensionFlag[3] = Utils.getByteAt(rawData, 540 + 3);
        if (this.extensionFlag[0]) {
          this.extensions = Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
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
      var fmt = Utils.formatNumber, string = "";
      string += "Datatype = " + +this.datatypeCode + " (" + this.getDatatypeCodeString(this.datatypeCode) + ")\n";
      string += "Bits Per Voxel =  = " + this.numBitsPerVoxel + "\n";
      string += "Image Dimensions (1-8): " + this.dims[0] + ", " + this.dims[1] + ", " + this.dims[2] + ", " + this.dims[3] + ", " + this.dims[4] + ", " + this.dims[5] + ", " + this.dims[6] + ", " + this.dims[7] + "\n";
      string += "Intent Parameters (1-3): " + this.intent_p1 + ", " + this.intent_p2 + ", " + this.intent_p3 + "\n";
      string += "Voxel Dimensions (1-8): " + fmt(this.pixDims[0]) + ", " + fmt(this.pixDims[1]) + ", " + fmt(this.pixDims[2]) + ", " + fmt(this.pixDims[3]) + ", " + fmt(this.pixDims[4]) + ", " + fmt(this.pixDims[5]) + ", " + fmt(this.pixDims[6]) + ", " + fmt(this.pixDims[7]) + "\n";
      string += "Image Offset = " + this.vox_offset + "\n";
      string += "Data Scale:  Slope = " + fmt(this.scl_slope) + "  Intercept = " + fmt(this.scl_inter) + "\n";
      string += "Display Range:  Max = " + fmt(this.cal_max) + "  Min = " + fmt(this.cal_min) + "\n";
      string += "Slice Duration = " + this.slice_duration + "\n";
      string += "Time Axis Shift = " + this.toffset + "\n";
      string += "Slice Start = " + this.slice_start + "\n";
      string += "Slice End = " + this.slice_end + "\n";
      string += 'Description: "' + this.description + '"\n';
      string += 'Auxiliary File: "' + this.aux_file + '"\n';
      string += "Q-Form Code = " + this.qform_code + " (" + this.getTransformCodeString(this.qform_code) + ")\n";
      string += "S-Form Code = " + this.sform_code + " (" + this.getTransformCodeString(this.sform_code) + ")\n";
      string += "Quaternion Parameters:  b = " + fmt(this.quatern_b) + "  c = " + fmt(this.quatern_c) + "  d = " + fmt(this.quatern_d) + "\n";
      string += "Quaternion Offsets:  x = " + this.qoffset_x + "  y = " + this.qoffset_y + "  z = " + this.qoffset_z + "\n";
      string += "S-Form Parameters X: " + fmt(this.affine[0][0]) + ", " + fmt(this.affine[0][1]) + ", " + fmt(this.affine[0][2]) + ", " + fmt(this.affine[0][3]) + "\n";
      string += "S-Form Parameters Y: " + fmt(this.affine[1][0]) + ", " + fmt(this.affine[1][1]) + ", " + fmt(this.affine[1][2]) + ", " + fmt(this.affine[1][3]) + "\n";
      string += "S-Form Parameters Z: " + fmt(this.affine[2][0]) + ", " + fmt(this.affine[2][1]) + ", " + fmt(this.affine[2][2]) + ", " + fmt(this.affine[2][3]) + "\n";
      string += "Slice Code = " + this.slice_code + "\n";
      string += "Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ")\n";
      string += "Intent Code = " + this.intent_code + "\n";
      string += 'Intent Name: "' + this.intent_name + '"\n';
      string += "Dim Info = " + this.dim_info + "\n";
      return string;
    }
    /**
     * Returns the byte index of the extension.
     * @returns {number}
     */
    getExtensionLocation = function() {
      return _NIFTI2.MAGIC_COOKIE + 4;
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
      let byteSize = 540 + 4;
      if (includeExtensions) {
        for (let extension of this.extensions) {
          byteSize += extension.esize;
        }
      }
      let byteArray = new Uint8Array(byteSize);
      let view = new DataView(byteArray.buffer);
      view.setInt32(0, 540, this.littleEndian);
      byteArray.set(new TextEncoder().encode(this.magic), 4);
      view.setInt16(12, this.datatypeCode, this.littleEndian);
      view.setInt16(14, this.numBitsPerVoxel, this.littleEndian);
      for (let i = 0; i < 8; i++) {
        view.setBigInt64(16 + INT64_SIZE * i, BigInt(this.dims[i]), this.littleEndian);
      }
      view.setFloat64(80, this.intent_p1, this.littleEndian);
      view.setFloat64(88, this.intent_p2, this.littleEndian);
      view.setFloat64(96, this.intent_p3, this.littleEndian);
      for (let i = 0; i < 8; i++) {
        view.setFloat64(104 + DOUBLE_SIZE * i, this.pixDims[i], this.littleEndian);
      }
      view.setBigInt64(168, BigInt(this.vox_offset), this.littleEndian);
      view.setFloat64(176, this.scl_slope, this.littleEndian);
      view.setFloat64(184, this.scl_inter, this.littleEndian);
      view.setFloat64(192, this.cal_max, this.littleEndian);
      view.setFloat64(200, this.cal_min, this.littleEndian);
      view.setFloat64(208, this.slice_duration, this.littleEndian);
      view.setFloat64(216, this.toffset, this.littleEndian);
      view.setBigInt64(224, BigInt(this.slice_start), this.littleEndian);
      view.setBigInt64(232, BigInt(this.slice_end), this.littleEndian);
      byteArray.set(new TextEncoder().encode(this.description), 240);
      byteArray.set(new TextEncoder().encode(this.aux_file), 320);
      view.setInt32(344, this.qform_code, this.littleEndian);
      view.setInt32(348, this.sform_code, this.littleEndian);
      view.setFloat64(352, this.quatern_b, this.littleEndian);
      view.setFloat64(360, this.quatern_c, this.littleEndian);
      view.setFloat64(368, this.quatern_d, this.littleEndian);
      view.setFloat64(376, this.qoffset_x, this.littleEndian);
      view.setFloat64(384, this.qoffset_y, this.littleEndian);
      view.setFloat64(392, this.qoffset_z, this.littleEndian);
      const flattened = this.affine.flat();
      for (let i = 0; i < 12; i++) {
        view.setFloat64(400 + DOUBLE_SIZE * i, flattened[i], this.littleEndian);
      }
      view.setInt32(496, this.slice_code, this.littleEndian);
      view.setInt32(500, this.xyzt_units, this.littleEndian);
      view.setInt32(504, this.intent_code, this.littleEndian);
      byteArray.set(new TextEncoder().encode(this.intent_name), 508);
      view.setUint8(524, this.dim_info);
      if (includeExtensions) {
        byteArray.set(Uint8Array.from([1, 0, 0, 0]), 540);
        let extensionByteIndex = this.getExtensionLocation();
        for (const extension of this.extensions) {
          view.setInt32(extensionByteIndex, extension.esize, extension.littleEndian);
          view.setInt32(extensionByteIndex + 4, extension.ecode, extension.littleEndian);
          byteArray.set(new Uint8Array(extension.edata), extensionByteIndex + 8);
          extensionByteIndex += extension.esize;
        }
      } else {
        byteArray.set(new Uint8Array(4).fill(0), 540);
      }
      return byteArray.buffer;
    }
  };

  // dist/src/nifti.js
  function isNIFTI1(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }
    buf = new DataView(data);
    if (buf)
      mag1 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK && mag1 === NIFTI1.MAGIC_NUMBER2[0] && mag2 === NIFTI1.MAGIC_NUMBER2[1] && mag3 === NIFTI1.MAGIC_NUMBER2[2])
      return true;
    return !!(mag1 === NIFTI1.MAGIC_NUMBER[0] && mag2 === NIFTI1.MAGIC_NUMBER[1] && mag3 === NIFTI1.MAGIC_NUMBER[2]);
  }
  function isNIFTI2(data, isHdrImgPairOK = false) {
    var buf, mag1, mag2, mag3;
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }
    buf = new DataView(data);
    mag1 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION);
    mag2 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    mag3 = buf.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 2);
    if (isHdrImgPairOK && mag1 === NIFTI2.MAGIC_NUMBER2[0] && mag2 === NIFTI2.MAGIC_NUMBER2[1] && mag3 === NIFTI2.MAGIC_NUMBER2[2])
      return true;
    return !!(mag1 === NIFTI2.MAGIC_NUMBER[0] && mag2 === NIFTI2.MAGIC_NUMBER[1] && mag3 === NIFTI2.MAGIC_NUMBER[2]);
  }
  function isNIFTI(data, isHdrImgPairOK = false) {
    return isNIFTI1(data, isHdrImgPairOK) || isNIFTI2(data, isHdrImgPairOK);
  }
  function isCompressed(data) {
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
  function decompress(data) {
    return decompressSync(new Uint8Array(data)).buffer;
  }
  function readHeader(data, isHdrImgPairOK = false) {
    let header = null;
    if (isCompressed(data)) {
      data = decompress(data);
    }
    if (isNIFTI1(data, isHdrImgPairOK)) {
      header = new NIFTI1();
    } else if (isNIFTI2(data, isHdrImgPairOK)) {
      header = new NIFTI2();
    }
    if (header) {
      header.readHeader(data);
    } else {
      throw new Error("That file does not appear to be NIFTI!");
    }
    return header;
  }
  function hasExtension(header) {
    return header.extensionFlag[0] != 0;
  }
  function readImage(header, data) {
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
  function readExtension(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc, loc + size);
  }
  function readExtensionData(header, data) {
    var loc = header.getExtensionLocation(), size = header.extensionSize;
    return data.slice(loc + 8, loc + size);
  }
})();
