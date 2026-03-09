require('./env.js')
require('./signv2.js')

const CryptoJS = require("crypto-js");


const c = [
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

function tripletToBase64(a) {
    return c[a >> 18 & 63] + c[a >> 12 & 63] + c[a >> 6 & 63] + c[63 & a]
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

function seccore_signv2(e, a) {
    var r = window.toString
        , c = e;
    var d = CryptoJS.MD5(([c].join(""))).toString()
        , f = window.mnsv2(c, d)
        , s = {
        x0: "4.2.5",
        x1: "xhs-pc-web",
        x2: 'Mac OS' || "PC",
        x3: f,
        x4: "object"
    };

    console.log(s)
    const timestamp = new Date().getTime();
    console.log(timestamp); // 示例输出：1755313363043
    return {'x-s':"XYS_" + b64Encode(encodeUtf8(JSON.stringify(s))),'x-t':timestamp}
}


// 'x-b3-traceid'
var S = "abcdef0123456789"
    , k = 16;

function generateTraceId() {
    for (var e = "", a = 0; a < 16; a++)
        e += S.charAt(Math.floor(Math.random() * k));
    return e
}

function traceId(timestamp = Date.now()) {
    // 时间戳部分（BigInt 运算）
    const timePart = (BigInt(timestamp) << 23n | getSeqNumber())
        .toString(16)
        .padStart(16, '0');

    // 随机部分（BigInt 运算）
    const randomPart = (BigInt(getRandom32Bits()) << 32n | BigInt(getRandom32Bits()))
        .toString(16)
        .padStart(16, '0');

    return timePart + randomPart;
}

// 返回 BigInt 的序列号
let seq = 0n;

function getSeqNumber() {
    seq = (seq + 1n) & 0x7FFFFFn; // 23 位掩码
    return seq;
}

// 返回 32 位随机数（Number 类型）
function getRandom32Bits() {
    return Math.floor(Math.random() * 0x100000000) >>> 0;
}


c_ = '/api/sns/web/v1/homefeed'
f = {
    "cursor_score": "1.7543627959610028E9",
    "num": 30,
    "refresh_type": 3,
    "note_index": 70,
    "unread_begin_note_id": "",
    "unread_end_note_id": "",
    "unread_note_count": 0,
    "category": "homefeed_recommend",
    "search_key": "",
    "need_num": 10,
    "image_formats": [
        "jpg",
        "webp",
        "avif"
    ],
    "need_filter_image": false
}

console.log(window.mnsv2(c, d))
