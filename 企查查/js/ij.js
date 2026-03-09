// i.default = function (e) {
//     var t = e.url.replace(e.baseURL, "")
//         , n = o.default.stringify(e.params || {});
//     n && (t += (-1 === t.indexOf("?") ? "?" : o.default.options.delimiter || "&") + n),
//         t = t.toLowerCase();
//     var i = (0,
//         a.default)(t, e.data)
//         , l = (0,
//         r.default)(t, e.data, (0,
//         s.default)());
//     e.headers[i] = l
// }



window = global;
var CryptoJS = require('crypto-js');

function o(e, t) {
    return CryptoJS.HmacSHA512(e, t).toString()
}
var jl = function () {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        , t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""
        , n = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase()
        , i = JSON.stringify(e).toLowerCase();
    return (0,
        o)(n + "pathString" + i + t, (0,
        a)(n))
}
// var o = function (e, t) {
//     return jmhmc().HmacSHA512(e, t).toString()
// }
var codes = {
    "n": 20,
    "codes": {
        "0": "W",
        "1": "l",
        "2": "k",
        "3": "B",
        "4": "Q",
        "5": "g",
        "6": "f",
        "7": "i",
        "8": "i",
        "9": "r",
        "10": "v",
        "11": "6",
        "12": "A",
        "13": "K",
        "14": "N",
        "15": "k",
        "16": "4",
        "17": "L",
        "18": "1",
        "19": "8"
    }
}

var a = function () {
    for (var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase(), t = e + e, n = "", i = 0; i < t.length; ++i) {
        var a = t[i].charCodeAt() % codes.n;
        n += codes.codes[a]
    }
    return n
}
var s = function () {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        , t = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase()
        , n = JSON.stringify(e).toLowerCase();
    return (0,
        o)(t + n, (0,
        a)(t)).toLowerCase().substr(8, 20)
}
var search = '/api/search/searchmulti';
var data = {
    "searchKey": "京龙",
    "pageIndex": 2,
    "pageSize": 20
}

var i = s(search, data)
var l = jl(search, data,'f0eb6cb19b190f6d0d95a3143a2e3b7c')

console.log(i)

console.log(l)
