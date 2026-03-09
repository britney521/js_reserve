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
    // var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
    var e = {}
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
var search = '/api/bigsearch/recruit?city=&companyscale=&education=&experience=&fromtime=&industry=&isfromsingleapp=true&issortasc=false&pageindex=1&pagesize=20&salary=&searchkey=%e7%94%b5%e8%af%9d%e9%94%80%e5%94%ae&sortfield=publishtime&totime=';

 function key() {
                var list = ["w", "i", "n", "d", "o", "w", ".", "t", "i", "d"];
                return eval(list.join(""))
            }
var i = s(search, undefined)
var l = jl(search, undefined,'d6f055163af721bdd4b322ee1b52c3cd')
var key_value = key()
console.log(i)
console.log(key_value)
console.log(l)

