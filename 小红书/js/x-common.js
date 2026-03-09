// function xsCommon(e, a) {
//     var r, c;
//     try {
//         var d = e.platform
//             , _ = a.url;
//         if (u.yl.map(function (e) {
//             return other RegExp(e)
//         }).some(function (e) {
//             return e.test(_)
//         }),
//             !(0,
//                 s.hF)(_))
//             return a;
//         var l = ""
//             , b = ""
//             , x = a.headers["X-Sign"] || ""
//             , v = l && b || x
//             , h = getSigCount(v)
//             , g = localStorage.getItem(u.q2)
//             , m = localStorage.getItem(u.z7) || u.fI
//             , y = {
//             s0: (0,
//                 s.SW)(d),
//             s1: "",
//             x0: m,
//             x1: u.i8,
//             x2: d || "PC",
//             x3: "xhs-pc-web",
//             x4: "4.72.0",
//             x5: f.Z.get(u.o4),
//             x6: l,
//             x7: b,
//             x8: g,
//             x9: (0,
//                 p.tb)("".concat(l).concat(b).concat(g)),
//             x10: h,
//             x11: "normal"
//         }
//             , w = u.LN.map(function (e) {
//             return other RegExp(e)
//         }).some(function (e) {
//             return e.test(_)
//         });
//         (null === (r = window.xhsFingerprintV3) || void 0 === r ? void 0 : r.getCurMiniUa) && w ? null === (c = window.xhsFingerprintV3) || void 0 === c || c.getCurMiniUa(function (e) {
//             y.x8 = e,
//                 y.x9 = (0,
//                     p.tb)("".concat(l).concat(b).concat(e)),
//                 a.headers["X-S-Common"] = (0,
//                     p.xE)((0,
//                     p.lz)(JSON.stringify(y)))
//         }) : a.headers["X-S-Common"] = (0,
//             p.xE)((0,
//             p.lz)(JSON.stringify(y)))
//     } catch (e) {
//     }
//     return a
// }

var c = [
    "Z",
    "m",
    "s",
    "e",
    "r",
    "b",
    "B",
    "o",
    "H",
    "Q",
    "t",
    "N",
    "P",
    "+",
    "w",
    "O",
    "c",
    "z",
    "a",
    "/",
    "L",
    "p",
    "n",
    "g",
    "G",
    "8",
    "y",
    "J",
    "q",
    "4",
    "2",
    "K",
    "W",
    "Y",
    "j",
    "0",
    "D",
    "S",
    "f",
    "d",
    "i",
    "k",
    "x",
    "3",
    "V",
    "T",
    "1",
    "6",
    "I",
    "l",
    "U",
    "A",
    "F",
    "M",
    "9",
    "7",
    "h",
    "E",
    "C",
    "v",
    "u",
    "R",
    "X",
    "5"
]
 function tripletToBase64(e) {
            return c[e >> 18 & 63] + c[e >> 12 & 63] + c[e >> 6 & 63] + c[63 & e]
        }
function encodeChunk(e, a, r) {
    for (var c, d = [], f = a; f < r; f += 3)
        c = (e[f] << 16 & 0xff0000) + (e[f + 1] << 8 & 65280) + (255 & e[f + 2]),
            d.push(tripletToBase64(c));
    return d.join("")
}

function b64Encode(e) {
    for (var a, r = e.length, d = r % 3, f = [], s = 16383, u = 0, l = r - d; u < l; u += s)
        f.push(encodeChunk(e, u, u + s > l ? l : u + s));
    return 1 === d ? (a = e[r - 1],
        f.push(c[a >> 2] + c[a << 4 & 63] + "==")) : 2 === d && (a = (e[r - 2] << 8) + e[r - 1],
        f.push(c[a >> 10] + c[a >> 4 & 63] + c[a << 2 & 63] + "=")),
        f.join("")
}

function encodeUtf8(e) {
    for (var a = encodeURIComponent(e), r = [], c = 0; c < a.length; c++) {
        var d = a.charAt(c);
        if ("%" === d) {
            var f = parseInt(a.charAt(c + 1) + a.charAt(c + 2), 16);
            r.push(f),
                c += 2
        } else
            r.push(d.charCodeAt(0))
    }
    return r
}

const crc32 = (function (a) {
    for (var e = 0xedb88320, r, c, d = 256, f = []; d--; f[d] = r >>> 0)
        for (c = 8,
                 r = d; c--;)
            r = 1 & r ? r >>> 1 ^ e : r >>> 1;
    return function (a) {
        if ("string" == typeof a) {
            for (var r = 0, c = -1; r < a.length; ++r)
                c = f[255 & c ^ a.charCodeAt(r)] ^ c >>> 8;
            return -1 ^ c ^ e
        }
        for (var r = 0, c = -1; r < a.length; ++r)
            c = f[255 & c ^ a[r]] ^ c >>> 8;
        return -1 ^ c ^ e
    }
})()

function get_x_common(a1) {

    g = 'I38rHdgsjopgIvesdVwgIC+oIELmBZ5e3VwXLgFTIxS3bqwErFeexd0ekncAzMFYnqthIhJeDfMDKutRI3KsYorWHPtGrbV0P9WfIi/eWc6eYqtyQApPI37ekmR1QL+5Ii6sdneeSfqYHqwl2qt5B0DBIx++GDi/sVtkIxdsxuwr4qtiIhuaIE3e3LV0I3VTIC7e0utl2ADmsLveDSKsSPw5IEvsiVtJOqw8BuwfPpdeTFWOIx4TIiu6ZPwrPut5IvlaLbgs3qtxIxes1VwHIkumIkIyejgsY/WTge7eSqte/D7sDcpipedeYrDtIC6eDVw2IENsSqtlnlSuNjVtIvoekqt3cZ7sVo4gIESyIhE2H7qUIxmPOzmoIicXePwFIviC2B3sDz7sxVtdIv6ed77eYjRyIi/e6WrF2PwjIhJs3oes6DveTPtNcU6eDuw5IvYpz03eduwugf/sDuwBI3E2IxmlsqtsaPwyssHbZAve3p/eDPwxICeskD0eSeHiIi7sjbos3grFIide6Vw3IirktutmtutFIxeeTPtFIhJeiVtlIkge0PtS+qwPzPwUIvhkIxcr4gHA+INeiPtjIhrtIhosjqtPLpQawrKsdfcdIhz/2uwZruwSICdskPtS+MKe1cAsiMmLIiAsx7esTutycPwqIC0efVtUIiNeTsuPICKeYo3eWVw5IxKs1uwuJBWYIEmgIvJs6Y0eTaesiLdedVtsIkGEI3l6/c=='

    y = {
        "s0": 3,
        "s1": "",
        "x0": "1",
        "x1": "4.2.5",
        "x2": "Mac OS",
        "x3": "xhs-pc-web",
        "x4": "4.75.3",
        "x5": a1,  // cookie a1
        "x6": "",
        "x7": "",
        "x8": g, //localStorage  b1
        "x9": crc32(g),
        "x10": 0,
        "x11": "normal"
    }
    console.log(y)

    x_common = b64Encode(encodeUtf8((JSON.stringify(y))))
    console.log(x_common.length)
    return x_common
}

get_x_common('19807e75ab2nkuq7je8ymue4uhpy2f83sihmqmams30000355430')

