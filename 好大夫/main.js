
n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
 on = {
            rotl: function(r, t) {
                return r << t | r >>> 32 - t
            },
            rotr: function(r, t) {
                return r << 32 - t | r >>> t
            },
            endian: function(r) {
                if (r.constructor == Number)
                    return 16711935 & on.rotl(r, 8) | 4278255360 & on.rotl(r, 24);
                for (var t = 0; t < r.length; t++)
                    r[t] = on.endian(r[t]);
                return r
            },
            randomBytes: function(r) {
                for (var t = []; r > 0; r--)
                    t.push(Math.floor(256 * Math.random()));
                return t
            },
            bytesToWords: function(r) {
                for (var t = [], e = 0, n = 0; e < r.length; e++,
                n += 8)
                    t[n >>> 5] |= r[e] << 24 - n % 32;
                return t
            },
            wordsToBytes: function(r) {
                for (var t = [], e = 0; e < 32 * r.length; e += 8)
                    t.push(r[e >>> 5] >>> 24 - e % 32 & 255);
                return t
            },
            bytesToHex: function(r) {
                for (var t = [], e = 0; e < r.length; e++)
                    t.push((r[e] >>> 4).toString(16)),
                    t.push((15 & r[e]).toString(16));
                return t.join("")
            },
            hexToBytes: function(r) {
                for (var t = [], e = 0; e < r.length; e += 2)
                    t.push(parseInt(r.substr(e, 2), 16));
                return t
            },
            bytesToBase64: function(r) {
                for (var t = [], e = 0; e < r.length; e += 3)
                    for (var o = r[e] << 16 | r[e + 1] << 8 | r[e + 2], u = 0; u < 4; u++)
                        8 * e + 6 * u <= 8 * r.length ? t.push(n.charAt(o >>> 6 * (3 - u) & 63)) : t.push("=");
                return t.join("")
            },
            base64ToBytes: function(r) {
                r = r.replace(/[^A-Z0-9+\/]/gi, "");
                for (var t = [], e = 0, o = 0; e < r.length; o = ++e % 4)
                    0 != o && t.push((n.indexOf(r.charAt(e - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | n.indexOf(r.charAt(e)) >>> 6 - 2 * o);
                return t
            }
        }

       

        var rec = {
            utf8: {
                stringToBytes: function(t) {
                    return rec.bin.stringToBytes(unescape(encodeURIComponent(t)))
                },
                bytesToString: function(t) {
                    return decodeURIComponent(escape(rec.bin.bytesToString(t)))
                }
            },
            bin: {
                stringToBytes: function(t) {
                    for (var e = [], r = 0; r < t.length; r++)
                        e.push(255 & t.charCodeAt(r));
                    return e
                },
                bytesToString: function(t) {
                    for (var e = [], r = 0; r < t.length; r++)
                        e.push(String.fromCharCode(t[r]));
                    return e.join("")
                }
            }
        };
        var o = rec.utf8


        function u(r, t) {
            r.constructor == String ? r = t && "binary" === t.encoding ? i.stringToBytes(r) : o.stringToBytes(r) : s(r) ? r = Array.prototype.slice.call(r, 0) : Array.isArray(r) || r.constructor === Uint8Array || (r = r.toString());
            for (var e = on.bytesToWords(r), c = 8 * r.length, a = 1732584193, f = -271733879, p = -1732584194, _ = 271733878, g = 0; g < e.length; g++)
                e[g] = 16711935 & (e[g] << 8 | e[g] >>> 24) | 4278255360 & (e[g] << 24 | e[g] >>> 8);
            e[c >>> 5] |= 128 << c % 32,
            e[14 + (c + 64 >>> 9 << 4)] = c;
            var y = u._ff
              , l = u._gg
              , x = u._hh
              , b = u._ii;
            for (g = 0; g < e.length; g += 16) {
                var h = a
                  , v = f
                  , m = p
                  , d = _;
                a = y(a, f, p, _, e[g + 0], 7, -680876936),
                _ = y(_, a, f, p, e[g + 1], 12, -389564586),
                p = y(p, _, a, f, e[g + 2], 17, 606105819),
                f = y(f, p, _, a, e[g + 3], 22, -1044525330),
                a = y(a, f, p, _, e[g + 4], 7, -176418897),
                _ = y(_, a, f, p, e[g + 5], 12, 1200080426),
                p = y(p, _, a, f, e[g + 6], 17, -1473231341),
                f = y(f, p, _, a, e[g + 7], 22, -45705983),
                a = y(a, f, p, _, e[g + 8], 7, 1770035416),
                _ = y(_, a, f, p, e[g + 9], 12, -1958414417),
                p = y(p, _, a, f, e[g + 10], 17, -42063),
                f = y(f, p, _, a, e[g + 11], 22, -1990404162),
                a = y(a, f, p, _, e[g + 12], 7, 1804603682),
                _ = y(_, a, f, p, e[g + 13], 12, -40341101),
                p = y(p, _, a, f, e[g + 14], 17, -1502002290),
                a = l(a, f = y(f, p, _, a, e[g + 15], 22, 1236535329), p, _, e[g + 1], 5, -165796510),
                _ = l(_, a, f, p, e[g + 6], 9, -1069501632),
                p = l(p, _, a, f, e[g + 11], 14, 643717713),
                f = l(f, p, _, a, e[g + 0], 20, -373897302),
                a = l(a, f, p, _, e[g + 5], 5, -701558691),
                _ = l(_, a, f, p, e[g + 10], 9, 38016083),
                p = l(p, _, a, f, e[g + 15], 14, -660478335),
                f = l(f, p, _, a, e[g + 4], 20, -405537848),
                a = l(a, f, p, _, e[g + 9], 5, 568446438),
                _ = l(_, a, f, p, e[g + 14], 9, -1019803690),
                p = l(p, _, a, f, e[g + 3], 14, -187363961),
                f = l(f, p, _, a, e[g + 8], 20, 1163531501),
                a = l(a, f, p, _, e[g + 13], 5, -1444681467),
                _ = l(_, a, f, p, e[g + 2], 9, -51403784),
                p = l(p, _, a, f, e[g + 7], 14, 1735328473),
                a = x(a, f = l(f, p, _, a, e[g + 12], 20, -1926607734), p, _, e[g + 5], 4, -378558),
                _ = x(_, a, f, p, e[g + 8], 11, -2022574463),
                p = x(p, _, a, f, e[g + 11], 16, 1839030562),
                f = x(f, p, _, a, e[g + 14], 23, -35309556),
                a = x(a, f, p, _, e[g + 1], 4, -1530992060),
                _ = x(_, a, f, p, e[g + 4], 11, 1272893353),
                p = x(p, _, a, f, e[g + 7], 16, -155497632),
                f = x(f, p, _, a, e[g + 10], 23, -1094730640),
                a = x(a, f, p, _, e[g + 13], 4, 681279174),
                _ = x(_, a, f, p, e[g + 0], 11, -358537222),
                p = x(p, _, a, f, e[g + 3], 16, -722521979),
                f = x(f, p, _, a, e[g + 6], 23, 76029189),
                a = x(a, f, p, _, e[g + 9], 4, -640364487),
                _ = x(_, a, f, p, e[g + 12], 11, -421815835),
                p = x(p, _, a, f, e[g + 15], 16, 530742520),
                a = b(a, f = x(f, p, _, a, e[g + 2], 23, -995338651), p, _, e[g + 0], 6, -198630844),
                _ = b(_, a, f, p, e[g + 7], 10, 1126891415),
                p = b(p, _, a, f, e[g + 14], 15, -1416354905),
                f = b(f, p, _, a, e[g + 5], 21, -57434055),
                a = b(a, f, p, _, e[g + 12], 6, 1700485571),
                _ = b(_, a, f, p, e[g + 3], 10, -1894986606),
                p = b(p, _, a, f, e[g + 10], 15, -1051523),
                f = b(f, p, _, a, e[g + 1], 21, -2054922799),
                a = b(a, f, p, _, e[g + 8], 6, 1873313359),
                _ = b(_, a, f, p, e[g + 15], 10, -30611744),
                p = b(p, _, a, f, e[g + 6], 15, -1560198380),
                f = b(f, p, _, a, e[g + 13], 21, 1309151649),
                a = b(a, f, p, _, e[g + 4], 6, -145523070),
                _ = b(_, a, f, p, e[g + 11], 10, -1120210379),
                p = b(p, _, a, f, e[g + 2], 15, 718787259),
                f = b(f, p, _, a, e[g + 9], 21, -343485551),
                a = a + h >>> 0,
                f = f + v >>> 0,
                p = p + m >>> 0,
                _ = _ + d >>> 0
            }
            return on.endian([a, f, p, _])
        }

        u._ff = function(r, t, e, n, o, s, i) {
            var u = r + (t & e | ~t & n) + (o >>> 0) + i;
            return (u << s | u >>> 32 - s) + t
        }
        ,
        u._gg = function(r, t, e, n, o, s, i) {
            var u = r + (t & n | e & ~n) + (o >>> 0) + i;
            return (u << s | u >>> 32 - s) + t
        }
        ,
        u._hh = function(r, t, e, n, o, s, i) {
            var u = r + (t ^ e ^ n) + (o >>> 0) + i;
            return (u << s | u >>> 32 - s) + t
        }
        ,
        u._ii = function(r, t, e, n, o, s, i) {
            var u = r + (e ^ (t | ~n)) + (o >>> 0) + i;
            return (u << s | u >>> 32 - s) + t
        }
        ,
        u._blocksize = 16,
        u._digestsize = 16
function res_f(r, t) {
            if (null == r)
                throw new Error("Illegal argument " + r);
            var e = on.wordsToBytes(u(r, t));

            return on.bytesToHex(e)
        }

        function get_xnoce(h) {
            // h = 'salt=haodf_2023&userId=11316547951&_an=hdfjia&_av=v20250924.1&_r=7&device_uuid=6336ea3709da0e3e2e8414a6db5dba31&doctorId=6964511836&siftId=1&nowPage=6&pageSize=10&diseaseId=&token=Bz1calVvUGNUaQ0_Az5QZQY0XG5VbQJAVmwLO1JtXW9Vb19vBToAMFppX2xWHwJoUTtbMwBtXTk'
            res = res_f(h)
            console.log('res:', res);
            return res
        }

