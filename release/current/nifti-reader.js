"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/fflate/lib/worker.cjs
  var require_worker = __commonJS({
    "node_modules/fflate/lib/worker.cjs"(exports) {
      "use strict";
      var ch2 = {};
      exports["default"] = function(c, id, msg, transfer, cb) {
        var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
          c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
        ], { type: "text/javascript" }))));
        w.onmessage = function(e) {
          var d = e.data, ed = d.$e$;
          if (ed) {
            var err = new Error(ed[0]);
            err["code"] = ed[1];
            err.stack = ed[2];
            cb(err, null);
          } else
            cb(null, d);
        };
        w.postMessage(msg, transfer);
        return w;
      };
    }
  });

  // node_modules/fflate/lib/index.cjs
  var require_lib = __commonJS({
    "node_modules/fflate/lib/index.cjs"(exports) {
      "use strict";
      var node_worker_1 = require_worker();
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
        for (var i2 = 0; i2 < 31; ++i2) {
          b[i2] = start += 1 << eb[i2 - 1];
        }
        var r = new u32(b[30]);
        for (var i2 = 1; i2 < 30; ++i2) {
          for (var j = b[i2]; j < b[i2 + 1]; ++j) {
            r[j] = j - b[i2] << 5 | i2;
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
        var i2 = 0;
        var l = new u16(mb);
        for (; i2 < s; ++i2) {
          if (cd[i2])
            ++l[cd[i2] - 1];
        }
        var le = new u16(mb);
        for (i2 = 0; i2 < mb; ++i2) {
          le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
        }
        var co;
        if (r) {
          co = new u16(1 << mb);
          var rvb = 15 - mb;
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              var sv = i2 << 4 | cd[i2];
              var r_1 = mb - cd[i2];
              var v = le[cd[i2] - 1]++ << r_1;
              for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
                co[rev[v] >>> rvb] = sv;
              }
            }
          }
        } else {
          co = new u16(s);
          for (i2 = 0; i2 < s; ++i2) {
            if (cd[i2]) {
              co[i2] = rev[le[cd[i2] - 1]++] >>> 15 - cd[i2];
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
      var flm = /* @__PURE__ */ hMap(flt, 9, 0);
      var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
      var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
      var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
      var max = function(a) {
        var m = a[0];
        for (var i2 = 1; i2 < a.length; ++i2) {
          if (a[i2] > m)
            m = a[i2];
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
      exports.FlateErrorCode = {
        UnexpectedEOF: 0,
        InvalidBlockType: 1,
        InvalidLengthLiteral: 2,
        InvalidDistance: 3,
        StreamFinished: 4,
        NoStreamHandler: 5,
        InvalidHeader: 6,
        NoCallback: 7,
        InvalidUTF8: 8,
        ExtraFieldTooLong: 9,
        InvalidDate: 10,
        FilenameTooLong: 11,
        StreamFinishing: 12,
        InvalidZipData: 13,
        UnknownCompressionMethod: 14
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
              for (var i2 = 0; i2 < hcLen; ++i2) {
                clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
              }
              pos += hcLen * 3;
              var clb = max(clt), clbmsk = (1 << clb) - 1;
              var clm = hMap(clt, clb, 1);
              for (var i2 = 0; i2 < tl; ) {
                var r = clm[bits(dat, pos, clbmsk)];
                pos += r & 15;
                var s = r >>> 4;
                if (s < 16) {
                  ldt[i2++] = s;
                } else {
                  var c = 0, n = 0;
                  if (s == 16)
                    n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
                  else if (s == 17)
                    n = 3 + bits(dat, pos, 7), pos += 3;
                  else if (s == 18)
                    n = 11 + bits(dat, pos, 127), pos += 7;
                  while (n--)
                    ldt[i2++] = c;
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
                var i2 = sym - 257, b = fleb[i2];
                add = bits(dat, pos, (1 << b) - 1) + fl[i2];
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
      var wbits = function(d, p, v) {
        v <<= p & 7;
        var o = p / 8 | 0;
        d[o] |= v;
        d[o + 1] |= v >>> 8;
      };
      var wbits16 = function(d, p, v) {
        v <<= p & 7;
        var o = p / 8 | 0;
        d[o] |= v;
        d[o + 1] |= v >>> 8;
        d[o + 2] |= v >>> 16;
      };
      var hTree = function(d, mb) {
        var t = [];
        for (var i2 = 0; i2 < d.length; ++i2) {
          if (d[i2])
            t.push({ s: i2, f: d[i2] });
        }
        var s = t.length;
        var t2 = t.slice();
        if (!s)
          return [et, 0];
        if (s == 1) {
          var v = new u8(t[0].s + 1);
          v[t[0].s] = 1;
          return [v, 1];
        }
        t.sort(function(a, b) {
          return a.f - b.f;
        });
        t.push({ s: -1, f: 25001 });
        var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
        t[0] = { s: -1, f: l.f + r.f, l, r };
        while (i1 != s - 1) {
          l = t[t[i0].f < t[i22].f ? i0++ : i22++];
          r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
          t[i1++] = { s: -1, f: l.f + r.f, l, r };
        }
        var maxSym = t2[0].s;
        for (var i2 = 1; i2 < s; ++i2) {
          if (t2[i2].s > maxSym)
            maxSym = t2[i2].s;
        }
        var tr = new u16(maxSym + 1);
        var mbt = ln(t[i1 - 1], tr, 0);
        if (mbt > mb) {
          var i2 = 0, dt = 0;
          var lft = mbt - mb, cst = 1 << lft;
          t2.sort(function(a, b) {
            return tr[b.s] - tr[a.s] || a.f - b.f;
          });
          for (; i2 < s; ++i2) {
            var i2_1 = t2[i2].s;
            if (tr[i2_1] > mb) {
              dt += cst - (1 << mbt - tr[i2_1]);
              tr[i2_1] = mb;
            } else
              break;
          }
          dt >>>= lft;
          while (dt > 0) {
            var i2_2 = t2[i2].s;
            if (tr[i2_2] < mb)
              dt -= 1 << mb - tr[i2_2]++ - 1;
            else
              ++i2;
          }
          for (; i2 >= 0 && dt; --i2) {
            var i2_3 = t2[i2].s;
            if (tr[i2_3] == mb) {
              --tr[i2_3];
              ++dt;
            }
          }
          mbt = mb;
        }
        return [new u8(tr), mbt];
      };
      var ln = function(n, l, d) {
        return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
      };
      var lc = function(c) {
        var s = c.length;
        while (s && !c[--s])
          ;
        var cl = new u16(++s);
        var cli = 0, cln = c[0], cls = 1;
        var w = function(v) {
          cl[cli++] = v;
        };
        for (var i2 = 1; i2 <= s; ++i2) {
          if (c[i2] == cln && i2 != s)
            ++cls;
          else {
            if (!cln && cls > 2) {
              for (; cls > 138; cls -= 138)
                w(32754);
              if (cls > 2) {
                w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
                cls = 0;
              }
            } else if (cls > 3) {
              w(cln), --cls;
              for (; cls > 6; cls -= 6)
                w(8304);
              if (cls > 2)
                w(cls - 3 << 5 | 8208), cls = 0;
            }
            while (cls--)
              w(cln);
            cls = 1;
            cln = c[i2];
          }
        }
        return [cl.subarray(0, cli), s];
      };
      var clen = function(cf, cl) {
        var l = 0;
        for (var i2 = 0; i2 < cl.length; ++i2)
          l += cf[i2] * cl[i2];
        return l;
      };
      var wfblk = function(out, pos, dat) {
        var s = dat.length;
        var o = shft(pos + 2);
        out[o] = s & 255;
        out[o + 1] = s >>> 8;
        out[o + 2] = out[o] ^ 255;
        out[o + 3] = out[o + 1] ^ 255;
        for (var i2 = 0; i2 < s; ++i2)
          out[o + i2 + 4] = dat[i2];
        return (o + 4 + s) * 8;
      };
      var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
        wbits(out, p++, final);
        ++lf[256];
        var _a2 = hTree(lf, 15), dlt = _a2[0], mlb = _a2[1];
        var _b2 = hTree(df, 15), ddt = _b2[0], mdb = _b2[1];
        var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
        var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
        var lcfreq = new u16(19);
        for (var i2 = 0; i2 < lclt.length; ++i2)
          lcfreq[lclt[i2] & 31]++;
        for (var i2 = 0; i2 < lcdt.length; ++i2)
          lcfreq[lcdt[i2] & 31]++;
        var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
        var nlcc = 19;
        for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
        var flen = bl + 5 << 3;
        var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
        var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
        if (flen <= ftlen && flen <= dtlen)
          return wfblk(out, p, dat.subarray(bs, bs + bl));
        var lm, ll, dm, dl;
        wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
        if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p, nlc - 257);
          wbits(out, p + 5, ndc - 1);
          wbits(out, p + 10, nlcc - 4);
          p += 14;
          for (var i2 = 0; i2 < nlcc; ++i2)
            wbits(out, p + 3 * i2, lct[clim[i2]]);
          p += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i2 = 0; i2 < clct.length; ++i2) {
              var len = clct[i2] & 31;
              wbits(out, p, llm[len]), p += lct[len];
              if (len > 15)
                wbits(out, p, clct[i2] >>> 5 & 127), p += clct[i2] >>> 12;
            }
          }
        } else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
        }
        for (var i2 = 0; i2 < li; ++i2) {
          if (syms[i2] > 255) {
            var len = syms[i2] >>> 18 & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
              wbits(out, p, syms[i2] >>> 23 & 31), p += fleb[len];
            var dst = syms[i2] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
              wbits16(out, p, syms[i2] >>> 5 & 8191), p += fdeb[dst];
          } else {
            wbits16(out, p, lm[syms[i2]]), p += ll[syms[i2]];
          }
        }
        wbits16(out, p, lm[256]);
        return p + ll[256];
      };
      var deo = /* @__PURE__ */ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
      var et = /* @__PURE__ */ new u8(0);
      var dflt = function(dat, lvl, plvl, pre, post, lst) {
        var s = dat.length;
        var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
        var w = o.subarray(pre, o.length - post);
        var pos = 0;
        if (!lvl || s < 8) {
          for (var i2 = 0; i2 <= s; i2 += 65535) {
            var e = i2 + 65535;
            if (e >= s) {
              w[pos >> 3] = lst;
            }
            pos = wfblk(w, pos + 1, dat.subarray(i2, e));
          }
        } else {
          var opt = deo[lvl - 1];
          var n = opt >>> 13, c = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          var prev = new u16(32768), head = new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function(i3) {
            return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
          };
          var syms = new u32(25e3);
          var lf = new u16(288), df = new u16(32);
          var lc_1 = 0, eb = 0, i2 = 0, li = 0, wi = 0, bs = 0;
          for (; i2 < s; ++i2) {
            var hv = hsh(i2);
            var imod = i2 & 32767, pimod = head[hv];
            prev[imod] = pimod;
            head[hv] = imod;
            if (wi <= i2) {
              var rem = s - i2;
              if ((lc_1 > 7e3 || li > 24576) && rem > 423) {
                pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
                li = lc_1 = eb = 0, bs = i2;
                for (var j = 0; j < 286; ++j)
                  lf[j] = 0;
                for (var j = 0; j < 30; ++j)
                  df[j] = 0;
              }
              var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
              if (rem > 2 && hv == hsh(i2 - dif)) {
                var maxn = Math.min(n, rem) - 1;
                var maxd = Math.min(32767, i2);
                var ml = Math.min(258, rem);
                while (dif <= maxd && --ch_1 && imod != pimod) {
                  if (dat[i2 + l] == dat[i2 + l - dif]) {
                    var nl = 0;
                    for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                      ;
                    if (nl > l) {
                      l = nl, d = dif;
                      if (nl > maxn)
                        break;
                      var mmd = Math.min(dif, nl - 2);
                      var md = 0;
                      for (var j = 0; j < mmd; ++j) {
                        var ti = i2 - dif + j + 32768 & 32767;
                        var pti = prev[ti];
                        var cd = ti - pti + 32768 & 32767;
                        if (cd > md)
                          md = cd, pimod = ti;
                      }
                    }
                  }
                  imod = pimod, pimod = prev[imod];
                  dif += imod - pimod + 32768 & 32767;
                }
              }
              if (d) {
                syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
                var lin = revfl[l] & 31, din = revfd[d] & 31;
                eb += fleb[lin] + fdeb[din];
                ++lf[257 + lin];
                ++df[din];
                wi = i2 + l;
                ++lc_1;
              } else {
                syms[li++] = dat[i2];
                ++lf[dat[i2]];
              }
            }
          }
          pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
          if (!lst && pos & 7)
            pos = wfblk(w, pos + 1, et);
        }
        return slc(o, 0, pre + shft(pos) + post);
      };
      var crct = /* @__PURE__ */ function() {
        var t = new Int32Array(256);
        for (var i2 = 0; i2 < 256; ++i2) {
          var c = i2, k = 9;
          while (--k)
            c = (c & 1 && -306674912) ^ c >>> 1;
          t[i2] = c;
        }
        return t;
      }();
      var crc = function() {
        var c = -1;
        return {
          p: function(d) {
            var cr = c;
            for (var i2 = 0; i2 < d.length; ++i2)
              cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
            c = cr;
          },
          d: function() {
            return ~c;
          }
        };
      };
      var adler = function() {
        var a = 1, b = 0;
        return {
          p: function(d) {
            var n = a, m = b;
            var l = d.length | 0;
            for (var i2 = 0; i2 != l; ) {
              var e = Math.min(i2 + 2655, l);
              for (; i2 < e; ++i2)
                m += n += d[i2];
              n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
            }
            a = n, b = m;
          },
          d: function() {
            a %= 65521, b %= 65521;
            return (a & 255) << 24 | a >>> 8 << 16 | (b & 255) << 8 | b >>> 8;
          }
        };
      };
      var dopt = function(dat, opt, pre, post, st) {
        return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, !st);
      };
      var mrg = function(a, b) {
        var o = {};
        for (var k in a)
          o[k] = a[k];
        for (var k in b)
          o[k] = b[k];
        return o;
      };
      var wcln = function(fn, fnStr, td2) {
        var dt = fn();
        var st = fn.toString();
        var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
        for (var i2 = 0; i2 < dt.length; ++i2) {
          var v = dt[i2], k = ks[i2];
          if (typeof v == "function") {
            fnStr += ";" + k + "=";
            var st_1 = v.toString();
            if (v.prototype) {
              if (st_1.indexOf("[native code]") != -1) {
                var spInd = st_1.indexOf(" ", 8) + 1;
                fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
              } else {
                fnStr += st_1;
                for (var t in v.prototype)
                  fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
              }
            } else
              fnStr += st_1;
          } else
            td2[k] = v;
        }
        return [fnStr, td2];
      };
      var ch = [];
      var cbfs = function(v) {
        var tl = [];
        for (var k in v) {
          if (v[k].buffer) {
            tl.push((v[k] = new v[k].constructor(v[k])).buffer);
          }
        }
        return tl;
      };
      var wrkr = function(fns, init, id, cb) {
        var _a2;
        if (!ch[id]) {
          var fnStr = "", td_1 = {}, m = fns.length - 1;
          for (var i2 = 0; i2 < m; ++i2)
            _a2 = wcln(fns[i2], fnStr, td_1), fnStr = _a2[0], td_1 = _a2[1];
          ch[id] = wcln(fns[m], fnStr, td_1);
        }
        var td2 = mrg({}, ch[id][1]);
        return node_worker_1["default"](ch[id][0] + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
      };
      var bInflt = function() {
        return [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gu8];
      };
      var bDflt = function() {
        return [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
      };
      var gze = function() {
        return [gzh, gzhl, wbytes, crc, crct];
      };
      var guze = function() {
        return [gzs, gzl];
      };
      var zle = function() {
        return [zlh, wbytes, adler];
      };
      var zule = function() {
        return [zlv];
      };
      var pbf = function(msg) {
        return postMessage(msg, [msg.buffer]);
      };
      var gu8 = function(o) {
        return o && o.size && new u8(o.size);
      };
      var cbify = function(dat, opts, fns, init, id, cb) {
        var w = wrkr(fns, init, id, function(err2, dat2) {
          w.terminate();
          cb(err2, dat2);
        });
        w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
        return function() {
          w.terminate();
        };
      };
      var astrm = function(strm) {
        strm.ondata = function(dat, final) {
          return postMessage([dat, final], [dat.buffer]);
        };
        return function(ev) {
          return strm.push(ev.data[0], ev.data[1]);
        };
      };
      var astrmify = function(fns, strm, opts, init, id) {
        var t;
        var w = wrkr(fns, init, id, function(err2, dat) {
          if (err2)
            w.terminate(), strm.ondata.call(strm, err2);
          else {
            if (dat[1])
              w.terminate();
            strm.ondata.call(strm, err2, dat[0], dat[1]);
          }
        });
        w.postMessage(opts);
        strm.push = function(d, f) {
          if (!strm.ondata)
            err(5);
          if (t)
            strm.ondata(err(4, 0, 1), null, !!f);
          w.postMessage([d, t = f], [d.buffer]);
        };
        strm.terminate = function() {
          w.terminate();
        };
      };
      var b2 = function(d, b) {
        return d[b] | d[b + 1] << 8;
      };
      var b4 = function(d, b) {
        return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
      };
      var b8 = function(d, b) {
        return b4(d, b) + b4(d, b + 4) * 4294967296;
      };
      var wbytes = function(d, b, v) {
        for (; v; ++b)
          d[b] = v, v >>>= 8;
      };
      var gzh = function(c, o) {
        var fn = o.filename;
        c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
        if (o.mtime != 0)
          wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
        if (fn) {
          c[3] = 8;
          for (var i2 = 0; i2 <= fn.length; ++i2)
            c[i2 + 10] = fn.charCodeAt(i2);
        }
      };
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
      var gzhl = function(o) {
        return 10 + (o.filename && o.filename.length + 1 || 0);
      };
      var zlh = function(c, o) {
        var lv = o.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
        c[0] = 120, c[1] = fl2 << 6 | (fl2 ? 32 - 2 * fl2 : 1);
      };
      var zlv = function(d) {
        if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31)
          err(6, "invalid zlib data");
        if (d[1] & 32)
          err(6, "invalid zlib data: preset dictionaries not supported");
      };
      function AsyncCmpStrm(opts, cb) {
        if (!cb && typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        return opts;
      }
      var Deflate = /* @__PURE__ */ function() {
        function Deflate2(opts, cb) {
          if (!cb && typeof opts == "function")
            cb = opts, opts = {};
          this.ondata = cb;
          this.o = opts || {};
        }
        Deflate2.prototype.p = function(c, f) {
          this.ondata(dopt(c, this.o, 0, 0, !f), f);
        };
        Deflate2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (this.d)
            err(4);
          this.d = final;
          this.p(chunk, final || false);
        };
        return Deflate2;
      }();
      exports.Deflate = Deflate;
      var AsyncDeflate = /* @__PURE__ */ function() {
        function AsyncDeflate2(opts, cb) {
          astrmify([
            bDflt,
            function() {
              return [astrm, Deflate];
            }
          ], this, AsyncCmpStrm.call(this, opts, cb), function(ev) {
            var strm = new Deflate(ev.data);
            onmessage = astrm(strm);
          }, 6);
        }
        return AsyncDeflate2;
      }();
      exports.AsyncDeflate = AsyncDeflate;
      function deflate(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt
        ], function(ev) {
          return pbf(deflateSync(ev.data[0], ev.data[1]));
        }, 0, cb);
      }
      exports.deflate = deflate;
      function deflateSync(data, opts) {
        return dopt(data, opts || {}, 0, 0);
      }
      exports.deflateSync = deflateSync;
      var Inflate = /* @__PURE__ */ function() {
        function Inflate2(cb) {
          this.s = {};
          this.p = new u8(0);
          this.ondata = cb;
        }
        Inflate2.prototype.e = function(c) {
          if (!this.ondata)
            err(5);
          if (this.d)
            err(4);
          var l = this.p.length;
          var n = new u8(l + c.length);
          n.set(this.p), n.set(c, l), this.p = n;
        };
        Inflate2.prototype.c = function(final) {
          this.d = this.s.i = final || false;
          var bts = this.s.b;
          var dt = inflt(this.p, this.o, this.s);
          this.ondata(slc(dt, bts, this.s.b), this.d);
          this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
          this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
        };
        Inflate2.prototype.push = function(chunk, final) {
          this.e(chunk), this.c(final);
        };
        return Inflate2;
      }();
      exports.Inflate = Inflate;
      var AsyncInflate = /* @__PURE__ */ function() {
        function AsyncInflate2(cb) {
          this.ondata = cb;
          astrmify([
            bInflt,
            function() {
              return [astrm, Inflate];
            }
          ], this, 0, function() {
            var strm = new Inflate();
            onmessage = astrm(strm);
          }, 7);
        }
        return AsyncInflate2;
      }();
      exports.AsyncInflate = AsyncInflate;
      function inflate(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt
        ], function(ev) {
          return pbf(inflateSync(ev.data[0], gu8(ev.data[1])));
        }, 1, cb);
      }
      exports.inflate = inflate;
      function inflateSync(data, out) {
        return inflt(data, out);
      }
      exports.inflateSync = inflateSync;
      var Gzip = /* @__PURE__ */ function() {
        function Gzip2(opts, cb) {
          this.c = crc();
          this.l = 0;
          this.v = 1;
          Deflate.call(this, opts, cb);
        }
        Gzip2.prototype.push = function(chunk, final) {
          Deflate.prototype.push.call(this, chunk, final);
        };
        Gzip2.prototype.p = function(c, f) {
          this.c.p(c);
          this.l += c.length;
          var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
          if (this.v)
            gzh(raw, this.o), this.v = 0;
          if (f)
            wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
          this.ondata(raw, f);
        };
        return Gzip2;
      }();
      exports.Gzip = Gzip;
      exports.Compress = Gzip;
      var AsyncGzip = /* @__PURE__ */ function() {
        function AsyncGzip2(opts, cb) {
          astrmify([
            bDflt,
            gze,
            function() {
              return [astrm, Deflate, Gzip];
            }
          ], this, AsyncCmpStrm.call(this, opts, cb), function(ev) {
            var strm = new Gzip(ev.data);
            onmessage = astrm(strm);
          }, 8);
        }
        return AsyncGzip2;
      }();
      exports.AsyncGzip = AsyncGzip;
      exports.AsyncCompress = AsyncGzip;
      function gzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt,
          gze,
          function() {
            return [gzipSync];
          }
        ], function(ev) {
          return pbf(gzipSync(ev.data[0], ev.data[1]));
        }, 2, cb);
      }
      exports.gzip = gzip;
      exports.compress = gzip;
      function gzipSync(data, opts) {
        if (!opts)
          opts = {};
        var c = crc(), l = data.length;
        c.p(data);
        var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
        return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
      }
      exports.gzipSync = gzipSync;
      exports.compressSync = gzipSync;
      var Gunzip = /* @__PURE__ */ function() {
        function Gunzip2(cb) {
          this.v = 1;
          Inflate.call(this, cb);
        }
        Gunzip2.prototype.push = function(chunk, final) {
          Inflate.prototype.e.call(this, chunk);
          if (this.v) {
            var s = this.p.length > 3 ? gzs(this.p) : 4;
            if (s >= this.p.length && !final)
              return;
            this.p = this.p.subarray(s), this.v = 0;
          }
          if (final) {
            if (this.p.length < 8)
              err(6, "invalid gzip data");
            this.p = this.p.subarray(0, -8);
          }
          Inflate.prototype.c.call(this, final);
        };
        return Gunzip2;
      }();
      exports.Gunzip = Gunzip;
      var AsyncGunzip = /* @__PURE__ */ function() {
        function AsyncGunzip2(cb) {
          this.ondata = cb;
          astrmify([
            bInflt,
            guze,
            function() {
              return [astrm, Inflate, Gunzip];
            }
          ], this, 0, function() {
            var strm = new Gunzip();
            onmessage = astrm(strm);
          }, 9);
        }
        return AsyncGunzip2;
      }();
      exports.AsyncGunzip = AsyncGunzip;
      function gunzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt,
          guze,
          function() {
            return [gunzipSync];
          }
        ], function(ev) {
          return pbf(gunzipSync(ev.data[0]));
        }, 3, cb);
      }
      exports.gunzip = gunzip;
      function gunzipSync(data, out) {
        return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
      }
      exports.gunzipSync = gunzipSync;
      var Zlib = /* @__PURE__ */ function() {
        function Zlib2(opts, cb) {
          this.c = adler();
          this.v = 1;
          Deflate.call(this, opts, cb);
        }
        Zlib2.prototype.push = function(chunk, final) {
          Deflate.prototype.push.call(this, chunk, final);
        };
        Zlib2.prototype.p = function(c, f) {
          this.c.p(c);
          var raw = dopt(c, this.o, this.v && 2, f && 4, !f);
          if (this.v)
            zlh(raw, this.o), this.v = 0;
          if (f)
            wbytes(raw, raw.length - 4, this.c.d());
          this.ondata(raw, f);
        };
        return Zlib2;
      }();
      exports.Zlib = Zlib;
      var AsyncZlib = /* @__PURE__ */ function() {
        function AsyncZlib2(opts, cb) {
          astrmify([
            bDflt,
            zle,
            function() {
              return [astrm, Deflate, Zlib];
            }
          ], this, AsyncCmpStrm.call(this, opts, cb), function(ev) {
            var strm = new Zlib(ev.data);
            onmessage = astrm(strm);
          }, 10);
        }
        return AsyncZlib2;
      }();
      exports.AsyncZlib = AsyncZlib;
      function zlib(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bDflt,
          zle,
          function() {
            return [zlibSync];
          }
        ], function(ev) {
          return pbf(zlibSync(ev.data[0], ev.data[1]));
        }, 4, cb);
      }
      exports.zlib = zlib;
      function zlibSync(data, opts) {
        if (!opts)
          opts = {};
        var a = adler();
        a.p(data);
        var d = dopt(data, opts, 2, 4);
        return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
      }
      exports.zlibSync = zlibSync;
      var Unzlib = /* @__PURE__ */ function() {
        function Unzlib2(cb) {
          this.v = 1;
          Inflate.call(this, cb);
        }
        Unzlib2.prototype.push = function(chunk, final) {
          Inflate.prototype.e.call(this, chunk);
          if (this.v) {
            if (this.p.length < 2 && !final)
              return;
            this.p = this.p.subarray(2), this.v = 0;
          }
          if (final) {
            if (this.p.length < 4)
              err(6, "invalid zlib data");
            this.p = this.p.subarray(0, -4);
          }
          Inflate.prototype.c.call(this, final);
        };
        return Unzlib2;
      }();
      exports.Unzlib = Unzlib;
      var AsyncUnzlib = /* @__PURE__ */ function() {
        function AsyncUnzlib2(cb) {
          this.ondata = cb;
          astrmify([
            bInflt,
            zule,
            function() {
              return [astrm, Inflate, Unzlib];
            }
          ], this, 0, function() {
            var strm = new Unzlib();
            onmessage = astrm(strm);
          }, 11);
        }
        return AsyncUnzlib2;
      }();
      exports.AsyncUnzlib = AsyncUnzlib;
      function unzlib(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return cbify(data, opts, [
          bInflt,
          zule,
          function() {
            return [unzlibSync];
          }
        ], function(ev) {
          return pbf(unzlibSync(ev.data[0], gu8(ev.data[1])));
        }, 5, cb);
      }
      exports.unzlib = unzlib;
      function unzlibSync(data, out) {
        return inflt((zlv(data), data.subarray(2, -4)), out);
      }
      exports.unzlibSync = unzlibSync;
      var Decompress = /* @__PURE__ */ function() {
        function Decompress2(cb) {
          this.G = Gunzip;
          this.I = Inflate;
          this.Z = Unzlib;
          this.ondata = cb;
        }
        Decompress2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (!this.s) {
            if (this.p && this.p.length) {
              var n = new u8(this.p.length + chunk.length);
              n.set(this.p), n.set(chunk, this.p.length);
            } else
              this.p = chunk;
            if (this.p.length > 2) {
              var _this_1 = this;
              var cb = function() {
                _this_1.ondata.apply(_this_1, arguments);
              };
              this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(cb) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(cb) : new this.Z(cb);
              this.s.push(this.p, final);
              this.p = null;
            }
          } else
            this.s.push(chunk, final);
        };
        return Decompress2;
      }();
      exports.Decompress = Decompress;
      var AsyncDecompress = /* @__PURE__ */ function() {
        function AsyncDecompress2(cb) {
          this.G = AsyncGunzip;
          this.I = AsyncInflate;
          this.Z = AsyncUnzlib;
          this.ondata = cb;
        }
        AsyncDecompress2.prototype.push = function(chunk, final) {
          Decompress.prototype.push.call(this, chunk, final);
        };
        return AsyncDecompress2;
      }();
      exports.AsyncDecompress = AsyncDecompress;
      function decompress(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
      }
      exports.decompress = decompress;
      function decompressSync(data, out) {
        return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, out) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, out) : unzlibSync(data, out);
      }
      exports.decompressSync = decompressSync;
      var fltn = function(d, p, t, o) {
        for (var k in d) {
          var val = d[k], n = p + k, op = o;
          if (Array.isArray(val))
            op = mrg(o, val[1]), val = val[0];
          if (val instanceof u8)
            t[n] = [val, op];
          else {
            t[n += "/"] = [new u8(0), op];
            fltn(val, n, t, o);
          }
        }
      };
      var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
      var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
      var tds = 0;
      try {
        td.decode(et, { stream: true });
        tds = 1;
      } catch (e) {
      }
      var dutf8 = function(d) {
        for (var r = "", i2 = 0; ; ) {
          var c = d[i2++];
          var eb = (c > 127) + (c > 223) + (c > 239);
          if (i2 + eb > d.length)
            return [r, slc(d, i2 - 1)];
          if (!eb)
            r += String.fromCharCode(c);
          else if (eb == 3) {
            c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
          } else if (eb & 1)
            r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
          else
            r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
        }
      };
      var DecodeUTF8 = /* @__PURE__ */ function() {
        function DecodeUTF82(cb) {
          this.ondata = cb;
          if (tds)
            this.t = new TextDecoder();
          else
            this.p = et;
        }
        DecodeUTF82.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          final = !!final;
          if (this.t) {
            this.ondata(this.t.decode(chunk, { stream: true }), final);
            if (final) {
              if (this.t.decode().length)
                err(8);
              this.t = null;
            }
            return;
          }
          if (!this.p)
            err(4);
          var dat = new u8(this.p.length + chunk.length);
          dat.set(this.p);
          dat.set(chunk, this.p.length);
          var _a2 = dutf8(dat), ch2 = _a2[0], np = _a2[1];
          if (final) {
            if (np.length)
              err(8);
            this.p = null;
          } else
            this.p = np;
          this.ondata(ch2, final);
        };
        return DecodeUTF82;
      }();
      exports.DecodeUTF8 = DecodeUTF8;
      var EncodeUTF8 = /* @__PURE__ */ function() {
        function EncodeUTF82(cb) {
          this.ondata = cb;
        }
        EncodeUTF82.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          if (this.d)
            err(4);
          this.ondata(strToU8(chunk), this.d = final || false);
        };
        return EncodeUTF82;
      }();
      exports.EncodeUTF8 = EncodeUTF8;
      function strToU8(str, latin1) {
        if (latin1) {
          var ar_1 = new u8(str.length);
          for (var i2 = 0; i2 < str.length; ++i2)
            ar_1[i2] = str.charCodeAt(i2);
          return ar_1;
        }
        if (te)
          return te.encode(str);
        var l = str.length;
        var ar = new u8(str.length + (str.length >> 1));
        var ai = 0;
        var w = function(v) {
          ar[ai++] = v;
        };
        for (var i2 = 0; i2 < l; ++i2) {
          if (ai + 5 > ar.length) {
            var n = new u8(ai + 8 + (l - i2 << 1));
            n.set(ar);
            ar = n;
          }
          var c = str.charCodeAt(i2);
          if (c < 128 || latin1)
            w(c);
          else if (c < 2048)
            w(192 | c >> 6), w(128 | c & 63);
          else if (c > 55295 && c < 57344)
            c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
          else
            w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
        }
        return slc(ar, 0, ai);
      }
      exports.strToU8 = strToU8;
      function strFromU8(dat, latin1) {
        if (latin1) {
          var r = "";
          for (var i2 = 0; i2 < dat.length; i2 += 16384)
            r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
          return r;
        } else if (td)
          return td.decode(dat);
        else {
          var _a2 = dutf8(dat), out = _a2[0], ext = _a2[1];
          if (ext.length)
            err(8);
          return out;
        }
      }
      exports.strFromU8 = strFromU8;
      var dbf = function(l) {
        return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0;
      };
      var slzh = function(d, b) {
        return b + 30 + b2(d, b + 26) + b2(d, b + 28);
      };
      var zh = function(d, b, z) {
        var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
        var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
        return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
      };
      var z64e = function(d, b) {
        for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
          ;
        return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
      };
      var exfl = function(ex) {
        var le = 0;
        if (ex) {
          for (var k in ex) {
            var l = ex[k].length;
            if (l > 65535)
              err(9);
            le += l + 4;
          }
        }
        return le;
      };
      var wzh = function(d, b, f, fn, u, c, ce, co) {
        var fl2 = fn.length, ex = f.extra, col = co && co.length;
        var exl = exfl(ex);
        wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
        if (ce != null)
          d[b++] = 20, d[b++] = f.os;
        d[b] = 20, b += 2;
        d[b++] = f.flag << 1 | (c == null && 8), d[b++] = u && 8;
        d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
        var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
        if (y < 0 || y > 119)
          err(10);
        wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >>> 1), b += 4;
        if (c != null) {
          wbytes(d, b, f.crc);
          wbytes(d, b + 4, c);
          wbytes(d, b + 8, f.size);
        }
        wbytes(d, b + 12, fl2);
        wbytes(d, b + 14, exl), b += 16;
        if (ce != null) {
          wbytes(d, b, col);
          wbytes(d, b + 6, f.attrs);
          wbytes(d, b + 10, ce), b += 14;
        }
        d.set(fn, b);
        b += fl2;
        if (exl) {
          for (var k in ex) {
            var exf = ex[k], l = exf.length;
            wbytes(d, b, +k);
            wbytes(d, b + 2, l);
            d.set(exf, b + 4), b += 4 + l;
          }
        }
        if (col)
          d.set(co, b), b += col;
        return b;
      };
      var wzf = function(o, b, c, d, e) {
        wbytes(o, b, 101010256);
        wbytes(o, b + 8, c);
        wbytes(o, b + 10, c);
        wbytes(o, b + 12, d);
        wbytes(o, b + 16, e);
      };
      var ZipPassThrough = /* @__PURE__ */ function() {
        function ZipPassThrough2(filename) {
          this.filename = filename;
          this.c = crc();
          this.size = 0;
          this.compression = 0;
        }
        ZipPassThrough2.prototype.process = function(chunk, final) {
          this.ondata(null, chunk, final);
        };
        ZipPassThrough2.prototype.push = function(chunk, final) {
          if (!this.ondata)
            err(5);
          this.c.p(chunk);
          this.size += chunk.length;
          if (final)
            this.crc = this.c.d();
          this.process(chunk, final || false);
        };
        return ZipPassThrough2;
      }();
      exports.ZipPassThrough = ZipPassThrough;
      var ZipDeflate = /* @__PURE__ */ function() {
        function ZipDeflate2(filename, opts) {
          var _this_1 = this;
          if (!opts)
            opts = {};
          ZipPassThrough.call(this, filename);
          this.d = new Deflate(opts, function(dat, final) {
            _this_1.ondata(null, dat, final);
          });
          this.compression = 8;
          this.flag = dbf(opts.level);
        }
        ZipDeflate2.prototype.process = function(chunk, final) {
          try {
            this.d.push(chunk, final);
          } catch (e) {
            this.ondata(e, null, final);
          }
        };
        ZipDeflate2.prototype.push = function(chunk, final) {
          ZipPassThrough.prototype.push.call(this, chunk, final);
        };
        return ZipDeflate2;
      }();
      exports.ZipDeflate = ZipDeflate;
      var AsyncZipDeflate = /* @__PURE__ */ function() {
        function AsyncZipDeflate2(filename, opts) {
          var _this_1 = this;
          if (!opts)
            opts = {};
          ZipPassThrough.call(this, filename);
          this.d = new AsyncDeflate(opts, function(err2, dat, final) {
            _this_1.ondata(err2, dat, final);
          });
          this.compression = 8;
          this.flag = dbf(opts.level);
          this.terminate = this.d.terminate;
        }
        AsyncZipDeflate2.prototype.process = function(chunk, final) {
          this.d.push(chunk, final);
        };
        AsyncZipDeflate2.prototype.push = function(chunk, final) {
          ZipPassThrough.prototype.push.call(this, chunk, final);
        };
        return AsyncZipDeflate2;
      }();
      exports.AsyncZipDeflate = AsyncZipDeflate;
      var Zip = /* @__PURE__ */ function() {
        function Zip2(cb) {
          this.ondata = cb;
          this.u = [];
          this.d = 1;
        }
        Zip2.prototype.add = function(file) {
          var _this_1 = this;
          if (!this.ondata)
            err(5);
          if (this.d & 2)
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
          else {
            var f = strToU8(file.filename), fl_1 = f.length;
            var com = file.comment, o = com && strToU8(com);
            var u = fl_1 != file.filename.length || o && com.length != o.length;
            var hl_1 = fl_1 + exfl(file.extra) + 30;
            if (fl_1 > 65535)
              this.ondata(err(11, 0, 1), null, false);
            var header = new u8(hl_1);
            wzh(header, 0, file, f, u);
            var chks_1 = [header];
            var pAll_1 = function() {
              for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
                var chk = chks_2[_i];
                _this_1.ondata(null, chk, false);
              }
              chks_1 = [];
            };
            var tr_1 = this.d;
            this.d = 0;
            var ind_1 = this.u.length;
            var uf_1 = mrg(file, {
              f,
              u,
              o,
              t: function() {
                if (file.terminate)
                  file.terminate();
              },
              r: function() {
                pAll_1();
                if (tr_1) {
                  var nxt = _this_1.u[ind_1 + 1];
                  if (nxt)
                    nxt.r();
                  else
                    _this_1.d = 1;
                }
                tr_1 = 1;
              }
            });
            var cl_1 = 0;
            file.ondata = function(err2, dat, final) {
              if (err2) {
                _this_1.ondata(err2, dat, final);
                _this_1.terminate();
              } else {
                cl_1 += dat.length;
                chks_1.push(dat);
                if (final) {
                  var dd = new u8(16);
                  wbytes(dd, 0, 134695760);
                  wbytes(dd, 4, file.crc);
                  wbytes(dd, 8, cl_1);
                  wbytes(dd, 12, file.size);
                  chks_1.push(dd);
                  uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                  if (tr_1)
                    uf_1.r();
                  tr_1 = 1;
                } else if (tr_1)
                  pAll_1();
              }
            };
            this.u.push(uf_1);
          }
        };
        Zip2.prototype.end = function() {
          var _this_1 = this;
          if (this.d & 2) {
            this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
            return;
          }
          if (this.d)
            this.e();
          else
            this.u.push({
              r: function() {
                if (!(_this_1.d & 1))
                  return;
                _this_1.u.splice(-1, 1);
                _this_1.e();
              },
              t: function() {
              }
            });
          this.d = 3;
        };
        Zip2.prototype.e = function() {
          var bt = 0, l = 0, tl = 0;
          for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
            var f = _a2[_i];
            tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
          }
          var out = new u8(tl + 22);
          for (var _b2 = 0, _c = this.u; _b2 < _c.length; _b2++) {
            var f = _c[_b2];
            wzh(out, bt, f, f.f, f.u, f.c, l, f.o);
            bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
          }
          wzf(out, bt, this.u.length, tl, l);
          this.ondata(null, out, true);
          this.d = 2;
        };
        Zip2.prototype.terminate = function() {
          for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
            var f = _a2[_i];
            f.t();
          }
          this.d = 2;
        };
        return Zip2;
      }();
      exports.Zip = Zip;
      function zip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        var r = {};
        fltn(data, "", r, opts);
        var k = Object.keys(r);
        var lft = k.length, o = 0, tot = 0;
        var slft = lft, files = new Array(lft);
        var term = [];
        var tAll = function() {
          for (var i3 = 0; i3 < term.length; ++i3)
            term[i3]();
        };
        var cbd = function(a, b) {
          mt(function() {
            cb(a, b);
          });
        };
        mt(function() {
          cbd = cb;
        });
        var cbf = function() {
          var out = new u8(tot + 22), oe = o, cdl = tot - o;
          tot = 0;
          for (var i3 = 0; i3 < slft; ++i3) {
            var f = files[i3];
            try {
              var l = f.c.length;
              wzh(out, tot, f, f.f, f.u, l);
              var badd = 30 + f.f.length + exfl(f.extra);
              var loc = tot + badd;
              out.set(f.c, loc);
              wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
            } catch (e) {
              return cbd(e, null);
            }
          }
          wzf(out, o, files.length, cdl, oe);
          cbd(null, out);
        };
        if (!lft)
          cbf();
        var _loop_1 = function(i3) {
          var fn = k[i3];
          var _a2 = r[fn], file = _a2[0], p = _a2[1];
          var c = crc(), size = file.length;
          c.p(file);
          var f = strToU8(fn), s = f.length;
          var com = p.comment, m = com && strToU8(com), ms = m && m.length;
          var exl = exfl(p.extra);
          var compression = p.level == 0 ? 0 : 8;
          var cbl = function(e, d) {
            if (e) {
              tAll();
              cbd(e, null);
            } else {
              var l = d.length;
              files[i3] = mrg(p, {
                size,
                crc: c.d(),
                c: d,
                f,
                m,
                u: s != fn.length || m && com.length != ms,
                compression
              });
              o += 30 + s + exl + l;
              tot += 76 + 2 * (s + exl) + (ms || 0) + l;
              if (!--lft)
                cbf();
            }
          };
          if (s > 65535)
            cbl(err(11, 0, 1), null);
          if (!compression)
            cbl(null, file);
          else if (size < 16e4) {
            try {
              cbl(null, deflateSync(file, p));
            } catch (e) {
              cbl(e, null);
            }
          } else
            term.push(deflate(file, p, cbl));
        };
        for (var i2 = 0; i2 < slft; ++i2) {
          _loop_1(i2);
        }
        return tAll;
      }
      exports.zip = zip;
      function zipSync(data, opts) {
        if (!opts)
          opts = {};
        var r = {};
        var files = [];
        fltn(data, "", r, opts);
        var o = 0;
        var tot = 0;
        for (var fn in r) {
          var _a2 = r[fn], file = _a2[0], p = _a2[1];
          var compression = p.level == 0 ? 0 : 8;
          var f = strToU8(fn), s = f.length;
          var com = p.comment, m = com && strToU8(com), ms = m && m.length;
          var exl = exfl(p.extra);
          if (s > 65535)
            err(11);
          var d = compression ? deflateSync(file, p) : file, l = d.length;
          var c = crc();
          c.p(file);
          files.push(mrg(p, {
            size: file.length,
            crc: c.d(),
            c: d,
            f,
            m,
            u: s != fn.length || m && com.length != ms,
            o,
            compression
          }));
          o += 30 + s + exl + l;
          tot += 76 + 2 * (s + exl) + (ms || 0) + l;
        }
        var out = new u8(tot + 22), oe = o, cdl = tot - o;
        for (var i2 = 0; i2 < files.length; ++i2) {
          var f = files[i2];
          wzh(out, f.o, f, f.f, f.u, f.c.length);
          var badd = 30 + f.f.length + exfl(f.extra);
          out.set(f.c, f.o + badd);
          wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
        }
        wzf(out, o, files.length, cdl, oe);
        return out;
      }
      exports.zipSync = zipSync;
      var UnzipPassThrough = /* @__PURE__ */ function() {
        function UnzipPassThrough2() {
        }
        UnzipPassThrough2.prototype.push = function(data, final) {
          this.ondata(null, data, final);
        };
        UnzipPassThrough2.compression = 0;
        return UnzipPassThrough2;
      }();
      exports.UnzipPassThrough = UnzipPassThrough;
      var UnzipInflate = /* @__PURE__ */ function() {
        function UnzipInflate2() {
          var _this_1 = this;
          this.i = new Inflate(function(dat, final) {
            _this_1.ondata(null, dat, final);
          });
        }
        UnzipInflate2.prototype.push = function(data, final) {
          try {
            this.i.push(data, final);
          } catch (e) {
            this.ondata(e, null, final);
          }
        };
        UnzipInflate2.compression = 8;
        return UnzipInflate2;
      }();
      exports.UnzipInflate = UnzipInflate;
      var AsyncUnzipInflate = /* @__PURE__ */ function() {
        function AsyncUnzipInflate2(_, sz) {
          var _this_1 = this;
          if (sz < 32e4) {
            this.i = new Inflate(function(dat, final) {
              _this_1.ondata(null, dat, final);
            });
          } else {
            this.i = new AsyncInflate(function(err2, dat, final) {
              _this_1.ondata(err2, dat, final);
            });
            this.terminate = this.i.terminate;
          }
        }
        AsyncUnzipInflate2.prototype.push = function(data, final) {
          if (this.i.terminate)
            data = slc(data, 0);
          this.i.push(data, final);
        };
        AsyncUnzipInflate2.compression = 8;
        return AsyncUnzipInflate2;
      }();
      exports.AsyncUnzipInflate = AsyncUnzipInflate;
      var Unzip = /* @__PURE__ */ function() {
        function Unzip2(cb) {
          this.onfile = cb;
          this.k = [];
          this.o = {
            0: UnzipPassThrough
          };
          this.p = et;
        }
        Unzip2.prototype.push = function(chunk, final) {
          var _this_1 = this;
          if (!this.onfile)
            err(5);
          if (!this.p)
            err(4);
          if (this.c > 0) {
            var len = Math.min(this.c, chunk.length);
            var toAdd = chunk.subarray(0, len);
            this.c -= len;
            if (this.d)
              this.d.push(toAdd, !this.c);
            else
              this.k[0].push(toAdd);
            chunk = chunk.subarray(len);
            if (chunk.length)
              return this.push(chunk, final);
          } else {
            var f = 0, i2 = 0, is = void 0, buf = void 0;
            if (!this.p.length)
              buf = chunk;
            else if (!chunk.length)
              buf = this.p;
            else {
              buf = new u8(this.p.length + chunk.length);
              buf.set(this.p), buf.set(chunk, this.p.length);
            }
            var l = buf.length, oc = this.c, add = oc && this.d;
            var _loop_2 = function() {
              var _a2;
              var sig = b4(buf, i2);
              if (sig == 67324752) {
                f = 1, is = i2;
                this_1.d = null;
                this_1.c = 0;
                var bf = b2(buf, i2 + 6), cmp_1 = b2(buf, i2 + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i2 + 26), es = b2(buf, i2 + 28);
                if (l > i2 + 30 + fnl + es) {
                  var chks_3 = [];
                  this_1.k.unshift(chks_3);
                  f = 2;
                  var sc_1 = b4(buf, i2 + 18), su_1 = b4(buf, i2 + 22);
                  var fn_1 = strFromU8(buf.subarray(i2 + 30, i2 += 30 + fnl), !u);
                  if (sc_1 == 4294967295) {
                    _a2 = dd ? [-2] : z64e(buf, i2), sc_1 = _a2[0], su_1 = _a2[1];
                  } else if (dd)
                    sc_1 = -1;
                  i2 += es;
                  this_1.c = sc_1;
                  var d_1;
                  var file_1 = {
                    name: fn_1,
                    compression: cmp_1,
                    start: function() {
                      if (!file_1.ondata)
                        err(5);
                      if (!sc_1)
                        file_1.ondata(null, et, true);
                      else {
                        var ctr = _this_1.o[cmp_1];
                        if (!ctr)
                          file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                        d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                        d_1.ondata = function(err2, dat3, final2) {
                          file_1.ondata(err2, dat3, final2);
                        };
                        for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                          var dat2 = chks_4[_i];
                          d_1.push(dat2, false);
                        }
                        if (_this_1.k[0] == chks_3 && _this_1.c)
                          _this_1.d = d_1;
                        else
                          d_1.push(et, true);
                      }
                    },
                    terminate: function() {
                      if (d_1 && d_1.terminate)
                        d_1.terminate();
                    }
                  };
                  if (sc_1 >= 0)
                    file_1.size = sc_1, file_1.originalSize = su_1;
                  this_1.onfile(file_1);
                }
                return "break";
              } else if (oc) {
                if (sig == 134695760) {
                  is = i2 += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                  return "break";
                } else if (sig == 33639248) {
                  is = i2 -= 4, f = 3, this_1.c = 0;
                  return "break";
                }
              }
            };
            var this_1 = this;
            for (; i2 < l - 4; ++i2) {
              var state_1 = _loop_2();
              if (state_1 === "break")
                break;
            }
            this.p = et;
            if (oc < 0) {
              var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i2);
              if (add)
                add.push(dat, !!f);
              else
                this.k[+(f == 2)].push(dat);
            }
            if (f & 2)
              return this.push(buf.subarray(i2), final);
            this.p = buf.subarray(i2);
          }
          if (final) {
            if (this.c)
              err(13);
            this.p = null;
          }
        };
        Unzip2.prototype.register = function(decoder) {
          this.o[decoder.compression] = decoder;
        };
        return Unzip2;
      }();
      exports.Unzip = Unzip;
      var mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
        fn();
      };
      function unzip(data, opts, cb) {
        if (!cb)
          cb = opts, opts = {};
        if (typeof cb != "function")
          err(7);
        var term = [];
        var tAll = function() {
          for (var i3 = 0; i3 < term.length; ++i3)
            term[i3]();
        };
        var files = {};
        var cbd = function(a, b) {
          mt(function() {
            cb(a, b);
          });
        };
        mt(function() {
          cbd = cb;
        });
        var e = data.length - 22;
        for (; b4(data, e) != 101010256; --e) {
          if (!e || data.length - e > 65558) {
            cbd(err(13, 0, 1), null);
            return tAll;
          }
        }
        ;
        var lft = b2(data, e + 8);
        if (lft) {
          var c = lft;
          var o = b4(data, e + 16);
          var z = o == 4294967295;
          if (z) {
            e = b4(data, e - 12);
            if (b4(data, e) != 101075792) {
              cbd(err(13, 0, 1), null);
              return tAll;
            }
            c = lft = b4(data, e + 32);
            o = b4(data, e + 48);
          }
          var fltr = opts && opts.filter;
          var _loop_3 = function(i3) {
            var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
            o = no;
            var cbl = function(e2, d) {
              if (e2) {
                tAll();
                cbd(e2, null);
              } else {
                if (d)
                  files[fn] = d;
                if (!--lft)
                  cbd(null, files);
              }
            };
            if (!fltr || fltr({
              name: fn,
              size: sc,
              originalSize: su,
              compression: c_1
            })) {
              if (!c_1)
                cbl(null, slc(data, b, b + sc));
              else if (c_1 == 8) {
                var infl = data.subarray(b, b + sc);
                if (sc < 32e4) {
                  try {
                    cbl(null, inflateSync(infl, new u8(su)));
                  } catch (e2) {
                    cbl(e2, null);
                  }
                } else
                  term.push(inflate(infl, { size: su }, cbl));
              } else
                cbl(err(14, "unknown compression type " + c_1, 1), null);
            } else
              cbl(null, null);
          };
          for (var i2 = 0; i2 < c; ++i2) {
            _loop_3(i2);
          }
        } else
          cbd(null, {});
        return tAll;
      }
      exports.unzip = unzip;
      function unzipSync(data, opts) {
        var files = {};
        var e = data.length - 22;
        for (; b4(data, e) != 101010256; --e) {
          if (!e || data.length - e > 65558)
            err(13);
        }
        ;
        var c = b2(data, e + 8);
        if (!c)
          return {};
        var o = b4(data, e + 16);
        var z = o == 4294967295;
        if (z) {
          e = b4(data, e - 12);
          if (b4(data, e) != 101075792)
            err(13);
          c = b4(data, e + 32);
          o = b4(data, e + 48);
        }
        var fltr = opts && opts.filter;
        for (var i2 = 0; i2 < c; ++i2) {
          var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
          o = no;
          if (!fltr || fltr({
            name: fn,
            size: sc,
            originalSize: su,
            compression: c_2
          })) {
            if (!c_2)
              files[fn] = slc(data, b, b + sc);
            else if (c_2 == 8)
              files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
            else
              err(14, "unknown compression type " + c_2);
          }
        }
        return files;
      }
      exports.unzipSync = unzipSync;
    }
  });

  // dist/src/nifti-extension.js
  var require_nifti_extension = __commonJS({
    "dist/src/nifti-extension.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NIFTIEXTENSION = void 0;
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
      exports.NIFTIEXTENSION = NIFTIEXTENSION;
    }
  });

  // dist/src/utilities.js
  var require_utilities = __commonJS({
    "dist/src/utilities.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Utils = void 0;
      var nifti_extension_1 = require_nifti_extension();
      var _Utils = class {
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
        static getIntAt(data, start, littleEndian) {
          return data.getInt32(start, littleEndian);
        }
        static getFloatAt(data, start, littleEndian) {
          return data.getFloat32(start, littleEndian);
        }
        static getDoubleAt(data, start, littleEndian) {
          return data.getFloat64(start, littleEndian);
        }
        static getLongAt(data, start, littleEndian) {
          var ctr, array = [], value = 0;
          for (ctr = 0; ctr < 8; ctr += 1) {
            array[ctr] = _Utils.getByteAt(data, start + ctr);
          }
          for (ctr = array.length - 1; ctr >= 0; ctr--) {
            value = value * 256 + array[ctr];
          }
          return value;
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
            console.log("extensionByteIndex: " + (extensionByteIndex + 8) + " esize: " + esize);
            console.log(edata);
            let extension = new nifti_extension_1.NIFTIEXTENSION(esize, ecode, edata, extensionLittleEndian);
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
      var Utils = _Utils;
      /*** Static Pseudo-constants ***/
      __publicField(Utils, "crcTable", null);
      __publicField(Utils, "GUNZIP_MAGIC_COOKIE1", 31);
      __publicField(Utils, "GUNZIP_MAGIC_COOKIE2", 139);
      __publicField(Utils, "getByteAt", function(data, start) {
        return data.getInt8(start);
      });
      __publicField(Utils, "getShortAt", function(data, start, littleEndian) {
        return data.getInt16(start, littleEndian);
      });
      exports.Utils = Utils;
    }
  });

  // dist/src/nifti1.js
  var require_nifti1 = __commonJS({
    "dist/src/nifti1.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NIFTI1 = void 0;
      var utilities_1 = require_utilities();
      var _NIFTI1 = class {
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
        /*** Prototype Methods ***/
        /**
         * Reads the header data.
         * @param {ArrayBuffer} data
         */
        readHeader(data) {
          var rawData = new DataView(data), magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index;
          if (magicCookieVal !== _NIFTI1.MAGIC_COOKIE) {
            this.littleEndian = true;
            magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian);
          }
          if (magicCookieVal !== _NIFTI1.MAGIC_COOKIE) {
            throw new Error("This does not appear to be a NIFTI file!");
          }
          this.dim_info = utilities_1.Utils.getByteAt(rawData, 39);
          for (ctr = 0; ctr < 8; ctr += 1) {
            index = 40 + ctr * 2;
            this.dims[ctr] = utilities_1.Utils.getShortAt(rawData, index, this.littleEndian);
          }
          this.intent_p1 = utilities_1.Utils.getFloatAt(rawData, 56, this.littleEndian);
          this.intent_p2 = utilities_1.Utils.getFloatAt(rawData, 60, this.littleEndian);
          this.intent_p3 = utilities_1.Utils.getFloatAt(rawData, 64, this.littleEndian);
          this.intent_code = utilities_1.Utils.getShortAt(rawData, 68, this.littleEndian);
          this.datatypeCode = utilities_1.Utils.getShortAt(rawData, 70, this.littleEndian);
          this.numBitsPerVoxel = utilities_1.Utils.getShortAt(rawData, 72, this.littleEndian);
          this.slice_start = utilities_1.Utils.getShortAt(rawData, 74, this.littleEndian);
          for (ctr = 0; ctr < 8; ctr += 1) {
            index = 76 + ctr * 4;
            this.pixDims[ctr] = utilities_1.Utils.getFloatAt(rawData, index, this.littleEndian);
          }
          this.vox_offset = utilities_1.Utils.getFloatAt(rawData, 108, this.littleEndian);
          this.scl_slope = utilities_1.Utils.getFloatAt(rawData, 112, this.littleEndian);
          this.scl_inter = utilities_1.Utils.getFloatAt(rawData, 116, this.littleEndian);
          this.slice_end = utilities_1.Utils.getShortAt(rawData, 120, this.littleEndian);
          this.slice_code = utilities_1.Utils.getByteAt(rawData, 122);
          this.xyzt_units = utilities_1.Utils.getByteAt(rawData, 123);
          this.cal_max = utilities_1.Utils.getFloatAt(rawData, 124, this.littleEndian);
          this.cal_min = utilities_1.Utils.getFloatAt(rawData, 128, this.littleEndian);
          this.slice_duration = utilities_1.Utils.getFloatAt(rawData, 132, this.littleEndian);
          this.toffset = utilities_1.Utils.getFloatAt(rawData, 136, this.littleEndian);
          this.description = utilities_1.Utils.getStringAt(rawData, 148, 228);
          this.aux_file = utilities_1.Utils.getStringAt(rawData, 228, 252);
          this.qform_code = utilities_1.Utils.getShortAt(rawData, 252, this.littleEndian);
          this.sform_code = utilities_1.Utils.getShortAt(rawData, 254, this.littleEndian);
          this.quatern_b = utilities_1.Utils.getFloatAt(rawData, 256, this.littleEndian);
          this.quatern_c = utilities_1.Utils.getFloatAt(rawData, 260, this.littleEndian);
          this.quatern_d = utilities_1.Utils.getFloatAt(rawData, 264, this.littleEndian);
          this.quatern_a = Math.sqrt(1 - (Math.pow(this.quatern_b, 2) + Math.pow(this.quatern_c, 2) + Math.pow(this.quatern_d, 2)));
          this.qoffset_x = utilities_1.Utils.getFloatAt(rawData, 268, this.littleEndian);
          this.qoffset_y = utilities_1.Utils.getFloatAt(rawData, 272, this.littleEndian);
          this.qoffset_z = utilities_1.Utils.getFloatAt(rawData, 276, this.littleEndian);
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
                this.affine[ctrOut][ctrIn] = utilities_1.Utils.getFloatAt(rawData, index, this.littleEndian);
              }
            }
          }
          this.affine[3][0] = 0;
          this.affine[3][1] = 0;
          this.affine[3][2] = 0;
          this.affine[3][3] = 1;
          this.intent_name = utilities_1.Utils.getStringAt(rawData, 328, 344);
          this.magic = utilities_1.Utils.getStringAt(rawData, 344, 348);
          this.isHDR = this.magic === String.fromCharCode.apply(null, _NIFTI1.MAGIC_NUMBER2);
          if (rawData.byteLength > _NIFTI1.MAGIC_COOKIE) {
            this.extensionFlag[0] = utilities_1.Utils.getByteAt(rawData, 348);
            this.extensionFlag[1] = utilities_1.Utils.getByteAt(rawData, 348 + 1);
            this.extensionFlag[2] = utilities_1.Utils.getByteAt(rawData, 348 + 2);
            this.extensionFlag[3] = utilities_1.Utils.getByteAt(rawData, 348 + 3);
            let isExtensionCapable = true;
            if (!this.isHDR && this.vox_offset <= 352)
              isExtensionCapable = false;
            if (rawData.byteLength <= 352 + 16)
              isExtensionCapable = false;
            if (isExtensionCapable && this.extensionFlag[0]) {
              this.extensions = utilities_1.Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
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
          var fmt = utilities_1.Utils.formatNumber, string = "";
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
          return utilities_1.Utils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
        }
        /**
         * Returns the extension code.
         * @param {DataView} data
         * @returns {number}
         */
        getExtensionCode(data) {
          return utilities_1.Utils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
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
          byteArray.set(Buffer.from(this.description), 148);
          byteArray.set(Buffer.from(this.aux_file), 228);
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
          byteArray.set(Buffer.from(this.intent_name), 328);
          byteArray.set(Buffer.from(this.magic), 344);
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
      var NIFTI1 = _NIFTI1;
      /*** Static Pseudo-constants ***/
      // datatype codes
      __publicField(NIFTI1, "TYPE_NONE", 0);
      __publicField(NIFTI1, "TYPE_BINARY", 1);
      __publicField(NIFTI1, "TYPE_UINT8", 2);
      __publicField(NIFTI1, "TYPE_INT16", 4);
      __publicField(NIFTI1, "TYPE_INT32", 8);
      __publicField(NIFTI1, "TYPE_FLOAT32", 16);
      __publicField(NIFTI1, "TYPE_COMPLEX64", 32);
      __publicField(NIFTI1, "TYPE_FLOAT64", 64);
      __publicField(NIFTI1, "TYPE_RGB24", 128);
      __publicField(NIFTI1, "TYPE_INT8", 256);
      __publicField(NIFTI1, "TYPE_UINT16", 512);
      __publicField(NIFTI1, "TYPE_UINT32", 768);
      __publicField(NIFTI1, "TYPE_INT64", 1024);
      __publicField(NIFTI1, "TYPE_UINT64", 1280);
      __publicField(NIFTI1, "TYPE_FLOAT128", 1536);
      __publicField(NIFTI1, "TYPE_COMPLEX128", 1792);
      __publicField(NIFTI1, "TYPE_COMPLEX256", 2048);
      // transform codes
      __publicField(NIFTI1, "XFORM_UNKNOWN", 0);
      __publicField(NIFTI1, "XFORM_SCANNER_ANAT", 1);
      __publicField(NIFTI1, "XFORM_ALIGNED_ANAT", 2);
      __publicField(NIFTI1, "XFORM_TALAIRACH", 3);
      __publicField(NIFTI1, "XFORM_MNI_152", 4);
      // unit codes
      __publicField(NIFTI1, "SPATIAL_UNITS_MASK", 7);
      __publicField(NIFTI1, "TEMPORAL_UNITS_MASK", 56);
      __publicField(NIFTI1, "UNITS_UNKNOWN", 0);
      __publicField(NIFTI1, "UNITS_METER", 1);
      __publicField(NIFTI1, "UNITS_MM", 2);
      __publicField(NIFTI1, "UNITS_MICRON", 3);
      __publicField(NIFTI1, "UNITS_SEC", 8);
      __publicField(NIFTI1, "UNITS_MSEC", 16);
      __publicField(NIFTI1, "UNITS_USEC", 24);
      __publicField(NIFTI1, "UNITS_HZ", 32);
      __publicField(NIFTI1, "UNITS_PPM", 40);
      __publicField(NIFTI1, "UNITS_RADS", 48);
      // nifti1 codes
      __publicField(NIFTI1, "MAGIC_COOKIE", 348);
      __publicField(NIFTI1, "STANDARD_HEADER_SIZE", 348);
      __publicField(NIFTI1, "MAGIC_NUMBER_LOCATION", 344);
      __publicField(NIFTI1, "MAGIC_NUMBER", [110, 43, 49]);
      // n+1 (.nii)
      __publicField(NIFTI1, "MAGIC_NUMBER2", [110, 105, 49]);
      // ni1 (.hdr/.img)
      __publicField(NIFTI1, "EXTENSION_HEADER_SIZE", 8);
      exports.NIFTI1 = NIFTI1;
    }
  });

  // dist/src/nifti2.js
  var require_nifti2 = __commonJS({
    "dist/src/nifti2.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NIFTI2 = void 0;
      var nifti1_1 = require_nifti1();
      var utilities_1 = require_utilities();
      var _NIFTI2 = class {
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
        // ni2\0
        /*** Prototype Methods ***/
        /**
         * Reads the header data.
         * @param {ArrayBuffer} data
         */
        readHeader(data) {
          var rawData = new DataView(data), magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian), ctr, ctrOut, ctrIn, index, array;
          if (magicCookieVal !== _NIFTI2.MAGIC_COOKIE) {
            this.littleEndian = true;
            magicCookieVal = utilities_1.Utils.getIntAt(rawData, 0, this.littleEndian);
          }
          if (magicCookieVal !== _NIFTI2.MAGIC_COOKIE) {
            throw new Error("This does not appear to be a NIFTI file!");
          }
          this.magic = utilities_1.Utils.getStringAt(rawData, 4, 12);
          this.datatypeCode = utilities_1.Utils.getShortAt(rawData, 12, this.littleEndian);
          this.numBitsPerVoxel = utilities_1.Utils.getShortAt(rawData, 14, this.littleEndian);
          for (ctr = 0; ctr < 8; ctr += 1) {
            index = 16 + ctr * 8;
            this.dims[ctr] = utilities_1.Utils.getLongAt(rawData, index, this.littleEndian);
          }
          this.intent_p1 = utilities_1.Utils.getDoubleAt(rawData, 80, this.littleEndian);
          this.intent_p2 = utilities_1.Utils.getDoubleAt(rawData, 88, this.littleEndian);
          this.intent_p3 = utilities_1.Utils.getDoubleAt(rawData, 96, this.littleEndian);
          for (ctr = 0; ctr < 8; ctr += 1) {
            index = 104 + ctr * 8;
            this.pixDims[ctr] = utilities_1.Utils.getDoubleAt(rawData, index, this.littleEndian);
          }
          this.vox_offset = utilities_1.Utils.getLongAt(rawData, 168, this.littleEndian);
          this.scl_slope = utilities_1.Utils.getDoubleAt(rawData, 176, this.littleEndian);
          this.scl_inter = utilities_1.Utils.getDoubleAt(rawData, 184, this.littleEndian);
          this.cal_max = utilities_1.Utils.getDoubleAt(rawData, 192, this.littleEndian);
          this.cal_min = utilities_1.Utils.getDoubleAt(rawData, 200, this.littleEndian);
          this.slice_duration = utilities_1.Utils.getDoubleAt(rawData, 208, this.littleEndian);
          this.toffset = utilities_1.Utils.getDoubleAt(rawData, 216, this.littleEndian);
          this.slice_start = utilities_1.Utils.getLongAt(rawData, 224, this.littleEndian);
          this.slice_end = utilities_1.Utils.getLongAt(rawData, 232, this.littleEndian);
          this.description = utilities_1.Utils.getStringAt(rawData, 240, 240 + 80);
          this.aux_file = utilities_1.Utils.getStringAt(rawData, 320, 320 + 24);
          this.qform_code = utilities_1.Utils.getIntAt(rawData, 344, this.littleEndian);
          this.sform_code = utilities_1.Utils.getIntAt(rawData, 348, this.littleEndian);
          this.quatern_b = utilities_1.Utils.getDoubleAt(rawData, 352, this.littleEndian);
          this.quatern_c = utilities_1.Utils.getDoubleAt(rawData, 360, this.littleEndian);
          this.quatern_d = utilities_1.Utils.getDoubleAt(rawData, 368, this.littleEndian);
          this.qoffset_x = utilities_1.Utils.getDoubleAt(rawData, 376, this.littleEndian);
          this.qoffset_y = utilities_1.Utils.getDoubleAt(rawData, 384, this.littleEndian);
          this.qoffset_z = utilities_1.Utils.getDoubleAt(rawData, 392, this.littleEndian);
          for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
            for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
              index = 400 + (ctrOut * 4 + ctrIn) * 8;
              this.affine[ctrOut][ctrIn] = utilities_1.Utils.getDoubleAt(rawData, index, this.littleEndian);
            }
          }
          this.affine[3][0] = 0;
          this.affine[3][1] = 0;
          this.affine[3][2] = 0;
          this.affine[3][3] = 1;
          this.slice_code = utilities_1.Utils.getIntAt(rawData, 496, this.littleEndian);
          this.xyzt_units = utilities_1.Utils.getIntAt(rawData, 500, this.littleEndian);
          this.intent_code = utilities_1.Utils.getIntAt(rawData, 504, this.littleEndian);
          this.intent_name = utilities_1.Utils.getStringAt(rawData, 508, 508 + 16);
          this.dim_info = utilities_1.Utils.getByteAt(rawData, 524);
          if (rawData.byteLength > _NIFTI2.MAGIC_COOKIE) {
            this.extensionFlag[0] = utilities_1.Utils.getByteAt(rawData, 540);
            this.extensionFlag[1] = utilities_1.Utils.getByteAt(rawData, 540 + 1);
            this.extensionFlag[2] = utilities_1.Utils.getByteAt(rawData, 540 + 2);
            this.extensionFlag[3] = utilities_1.Utils.getByteAt(rawData, 540 + 3);
            if (this.extensionFlag[0]) {
              this.extensions = utilities_1.Utils.getExtensionsAt(rawData, this.getExtensionLocation(), this.littleEndian, this.vox_offset);
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
          var fmt = utilities_1.Utils.formatNumber, string = "";
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
          string += "Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(nifti1_1.NIFTI1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(nifti1_1.NIFTI1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ")\n";
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
        getExtensionSize = nifti1_1.NIFTI1.prototype.getExtensionSize;
        /**
         * Returns the extension code.
         * @param {DataView} data
         * @returns {number}
         */
        getExtensionCode = nifti1_1.NIFTI1.prototype.getExtensionCode;
        /**
         * Adds an extension
         * @param {NIFTIEXTENSION} extension
         * @param {number} index
         */
        addExtension = nifti1_1.NIFTI1.prototype.addExtension;
        /**
         * Removes an extension
         * @param {number} index
         */
        removeExtension = nifti1_1.NIFTI1.prototype.removeExtension;
        /**
         * Returns a human-readable string of datatype.
         * @param {number} code
         * @returns {string}
         */
        getDatatypeCodeString = nifti1_1.NIFTI1.prototype.getDatatypeCodeString;
        /**
         * Returns a human-readable string of transform type.
         * @param {number} code
         * @returns {string}
         */
        getTransformCodeString = nifti1_1.NIFTI1.prototype.getTransformCodeString;
        /**
         * Returns a human-readable string of spatial and temporal units.
         * @param {number} code
         * @returns {string}
         */
        getUnitsCodeString = nifti1_1.NIFTI1.prototype.getUnitsCodeString;
        /**
         * Returns the qform matrix.
         * @returns {Array.<Array.<number>>}
         */
        getQformMat = nifti1_1.NIFTI1.prototype.getQformMat;
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
        convertNiftiQFormToNiftiSForm = nifti1_1.NIFTI1.prototype.convertNiftiQFormToNiftiSForm;
        /**
         * Converts sform to an orientation string (e.g., XYZ+--).  (See http://nimh.nih.gov/pub/dist/src/niftilib/nifti1_io.c)
         * @param {Array.<Array.<number>>} R
         * @returns {string}
         */
        convertNiftiSFormToNEMA = nifti1_1.NIFTI1.prototype.convertNiftiSFormToNEMA;
        nifti_mat33_mul = nifti1_1.NIFTI1.prototype.nifti_mat33_mul;
        nifti_mat33_determ = nifti1_1.NIFTI1.prototype.nifti_mat33_determ;
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
          byteArray.set(Buffer.from(this.magic), 4);
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
          byteArray.set(Buffer.from(this.description), 240);
          byteArray.set(Buffer.from(this.aux_file), 320);
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
          byteArray.set(Buffer.from(this.intent_name), 508);
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
      var NIFTI2 = _NIFTI2;
      /*** Static Pseudo-constants ***/
      __publicField(NIFTI2, "MAGIC_COOKIE", 540);
      __publicField(NIFTI2, "MAGIC_NUMBER_LOCATION", 4);
      __publicField(NIFTI2, "MAGIC_NUMBER", [
        110,
        43,
        50,
        0,
        13,
        10,
        26,
        10
      ]);
      // n+2\0
      __publicField(NIFTI2, "MAGIC_NUMBER2", [
        110,
        105,
        50,
        0,
        13,
        10,
        26,
        10
      ]);
      exports.NIFTI2 = NIFTI2;
    }
  });

  // dist/src/nifti.js
  var require_nifti = __commonJS({
    "dist/src/nifti.js"(exports) {
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.readExtensionData = exports.readExtension = exports.readImage = exports.hasExtension = exports.readHeader = exports.decompress = exports.isCompressed = exports.isNIFTI = exports.isNIFTI2 = exports.isNIFTI1 = exports.NIFTIEXTENSION = exports.Utils = exports.NIFTI2 = exports.NIFTI1 = void 0;
      var fflate = __importStar(require_lib());
      var nifti1_1 = require_nifti1();
      var nifti2_1 = require_nifti2();
      var utilities_1 = require_utilities();
      var nifti1_2 = require_nifti1();
      Object.defineProperty(exports, "NIFTI1", { enumerable: true, get: function() {
        return nifti1_2.NIFTI1;
      } });
      var nifti2_2 = require_nifti2();
      Object.defineProperty(exports, "NIFTI2", { enumerable: true, get: function() {
        return nifti2_2.NIFTI2;
      } });
      var utilities_2 = require_utilities();
      Object.defineProperty(exports, "Utils", { enumerable: true, get: function() {
        return utilities_2.Utils;
      } });
      var nifti_extension_1 = require_nifti_extension();
      Object.defineProperty(exports, "NIFTIEXTENSION", { enumerable: true, get: function() {
        return nifti_extension_1.NIFTIEXTENSION;
      } });
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
        if (isHdrImgPairOK && mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER2[0] && mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER2[1] && mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER2[2])
          return true;
        return !!(mag1 === nifti1_1.NIFTI1.MAGIC_NUMBER[0] && mag2 === nifti1_1.NIFTI1.MAGIC_NUMBER[1] && mag3 === nifti1_1.NIFTI1.MAGIC_NUMBER[2]);
      }
      exports.isNIFTI1 = isNIFTI1;
      function isNIFTI2(data, isHdrImgPairOK = false) {
        var buf, mag1, mag2, mag3;
        if (data.byteLength < nifti1_1.NIFTI1.STANDARD_HEADER_SIZE) {
          return false;
        }
        buf = new DataView(data);
        mag1 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION);
        mag2 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 1);
        mag3 = buf.getUint8(nifti2_1.NIFTI2.MAGIC_NUMBER_LOCATION + 2);
        if (isHdrImgPairOK && mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER2[0] && mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER2[1] && mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER2[2])
          return true;
        return !!(mag1 === nifti2_1.NIFTI2.MAGIC_NUMBER[0] && mag2 === nifti2_1.NIFTI2.MAGIC_NUMBER[1] && mag3 === nifti2_1.NIFTI2.MAGIC_NUMBER[2]);
      }
      exports.isNIFTI2 = isNIFTI2;
      function isNIFTI(data, isHdrImgPairOK = false) {
        return isNIFTI1(data, isHdrImgPairOK) || isNIFTI2(data, isHdrImgPairOK);
      }
      exports.isNIFTI = isNIFTI;
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
      function decompress(data) {
        return fflate.decompressSync(new Uint8Array(data)).buffer;
      }
      exports.decompress = decompress;
      function readHeader(data, isHdrImgPairOK = false) {
        var header = null;
        if (isCompressed(data)) {
          data = decompress(data);
        }
        if (isNIFTI1(data, isHdrImgPairOK)) {
          header = new nifti1_1.NIFTI1();
        } else if (isNIFTI2(data, isHdrImgPairOK)) {
          header = new nifti2_1.NIFTI2();
        }
        if (header) {
          header.readHeader(data);
        } else {
          console.error("That file does not appear to be NIFTI!");
        }
        return header;
      }
      exports.readHeader = readHeader;
      function hasExtension(header) {
        return header.extensionFlag[0] != 0;
      }
      exports.hasExtension = hasExtension;
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
      exports.readImage = readImage;
      function readExtension(header, data) {
        var loc = header.getExtensionLocation(), size = header.extensionSize;
        return data.slice(loc, loc + size);
      }
      exports.readExtension = readExtension;
      function readExtensionData(header, data) {
        var loc = header.getExtensionLocation(), size = header.extensionSize;
        return data.slice(loc + 8, loc + size);
      }
      exports.readExtensionData = readExtensionData;
    }
  });
  require_nifti();
})();
