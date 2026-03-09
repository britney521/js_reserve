const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
    contentType: "text/html",
    url: "http://example.com"
});
var load;
document = dom.window.document;

// document = {
//     characterSet: "UTF-8",
//     charset: "UTF-8",
//     compatMode: "CSS1Compat",
//     createElement: function (arg) {
//         console.log("document.createElement ====>", arg)
//         if (arg === "span") {
//             return span
//         }
//     },
//     documentElement: {},
//     createEvent: function createEvent() {
//         console.log("document.createElement ====>", arg)
//     },
//     querySelector: function () {
//
//     },
//     ngOnDestroy:undefined,
//     createComment:function () {
//
//     }
// }
window = global;
window.addEventListener = function (){

}
Element = function () {

}
Element.prototype.animate = function (){

}
navigator = {
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    cpuClass:undefined,
    mimeTypes: {
        "0": {
            description: "Portable Document Format"
        },
        "1": {
            description: "Portable Document Format"
        }

    },
    cookieEnabled: true,
    appVersion: "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    appCodeName: "Mozilla",
    appName: "Netscape",
    language: 'zh-CN',
    languages: ['zh-CN', 'zh'],
    bluetooth: {
        [Symbol.toStringTag]: "Bluetooth"
    },
    credentials: {},
    deviceMemory: 8,
    platform: "MacIntel",
    product: "Gecko",
    productSub: "20030107",
    maxTouchPoints: 0,
    storage: {},
    requestMediaKeySystemAccess: function requestMediaKeySystemAccess() {
    },
    getBattery: function getBattery() {
        return {isCharging: true}
    },
    vibrate: function vibrate() {

    },
    connection: {},
    plugins: {
        length: 3,
        item: function item() {
        },
    },
    hardwareConcurrency: 12,
    webkitPersistentStorage: {},
    webkitTemporaryStorage: {},
    pdfViewerEnabled: true,
    geolocation: {
        "toString": function () {
            return "[object Geolocation]"
        }
    },
    doNotTrack: null,
    userActivation: {
        hasBeenActive: true,
        isActive: true
    },
    scheduling: {},
    vendorSub: "",
    vendor: "Google Inc.",
}
require('./all.js');
// require('./env1.js');
function get_enviroment(proxy_array) {
    for (var i = 0; i < proxy_array.length; i++) {
        handler = '{\n' +
            '    get: function(target, property, receiver) {\n' +
            '        console.log("方法:", "get  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            '        return target[property];\n' +
            '    },\n' +
            '    set: function(target, property, value, receiver) {\n' +
            '        console.log("方法:", "set  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            '        return Reflect.set(...arguments);\n' +
            '    }\n' +
            '}'
        eval('try{\n' + proxy_array[i] + ';\n'
            + proxy_array[i] + '=other Proxy(' + proxy_array[i] + ', ' + handler + ')}catch (e) {\n' + proxy_array[i] + '={};\n'
            + proxy_array[i] + '=other Proxy(' + proxy_array[i] + ', ' + handler + ')}')
    }
};

proxy_array = ['window', 'navigator', 'document', 'location', 'screen', 'canvas', 'history', 'script', 'meta', 'base', 'html'];

get_enviroment(proxy_array)
!function(e) {
    function a(a) {
        for (var f, n, d = a[0], o = a[1], b = a[2], i = 0, l = []; i < d.length; i++)
            n = d[i],
            Object.prototype.hasOwnProperty.call(r, n) && r[n] && l.push(r[n][0]),
            r[n] = 0;
        for (f in o)
            Object.prototype.hasOwnProperty.call(o, f) && (e[f] = o[f]);
        for (u && u(a); l.length; )
            l.shift()();
        return t.push.apply(t, b || []),
        c()
    }
    function c() {
        for (var e, a = 0; a < t.length; a++) {
            for (var c = t[a], f = !0, d = 1; d < c.length; d++)
                0 !== r[c[d]] && (f = !1);
            f && (t.splice(a--, 1),
            e = n(n.s = c[0]))
        }
        return e
    }
    var f = {}
      , r = {
        12: 0
    }
      , t = [];
    function n(a) {
        if (f[a])
            return f[a].exports;
        var c = f[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        console.log(a)
        return e[a].call(c.exports, c, c.exports, n),
        c.l = !0,
        c.exports
    }
    load = n,
    n.e = function(e) {
        var a = []
          , c = r[e];
        if (0 !== c)
            if (c)
                a.push(c[2]);
            else {
                var f = new Promise(function(a, f) {
                    c = r[e] = [a, f]
                }
                );
                a.push(c[2] = f);
                var t, d = document.createElement("script");
                d.charset = "utf-8",
                d.timeout = 120,
                n.nc && d.setAttribute("nonce", n.nc),
                d.src = function(e) {
                    return n.p + "" + ({
                        3: "common"
                    }[e] || e) + "." + {
                        0: "9a4f7e66f0a136d4a41e",
                        1: "7ec8aebda9412bdfac84",
                        2: "e7dcbe0cc4050d01fde7",
                        3: "38a5269154f6ab700db9",
                        4: "f48da0bb79d80696a01c",
                        5: "5fd9cfa2ffa78783c454",
                        6: "4786f657db4ce171b6fc",
                        7: "1af75709549a593a1b4d",
                        8: "c92c0ba755c53e81a96c",
                        9: "ef414bb14fef94fe9152",
                        10: "41378981b890531ee066",
                        11: "31551925b7f852951de7",
                        13: "7d8b79ed62af7e3a03ca",
                        14: "d1a8eec4b30d02d5c4a0",
                        15: "942434434ee94ebf2c7f",
                        16: "d3c92419a0438632c19f",
                        17: "0eef44d3dc439e6db1c9",
                        20: "c39e340ca3887c3e452b",
                        21: "841a46a4d3b6bfe87bf2",
                        22: "c1209ac05ad86d21acc1",
                        23: "9b523430be9527e127c7",
                        24: "6ac7ed71c4f3d7d208a2",
                        25: "84c649ebab43c9aba5b6",
                        26: "4ae05b70374d4f7777c0",
                        27: "f2bd2ad27bff01c8032f",
                        28: "6f9b0d30f8eaa259ae93",
                        29: "b4d37645f4f69032ac79",
                        30: "fcecc5f4f0ac52408b72",
                        31: "bd48a736cdee57746f49",
                        32: "ccf08ef5d5fd24db5d03",
                        33: "8e4a16ef4c419d9dd52b",
                        34: "1ef33dbb6022aaa2f7df",
                        35: "798415c5ef31a814ebc2",
                        36: "97a24f72edf90256be7b",
                        37: "134ad5260f4f2d3f6d13",
                        38: "10caa6e22b31523ad8ac",
                        39: "c126408c6605e2cf39da",
                        40: "08369455c2964ce14e46",
                        41: "6475a769ceff47a4902a",
                        42: "cc3b64eec3c5b38df6f4",
                        43: "1e60628c23c3b9d42cdb",
                        44: "b9477aed1dc2da70e5c2",
                        45: "a4cd7c7c67659c209191",
                        46: "f6a2ba7ae72a75d3b715",
                        47: "c51809a9fc1e0731c50c",
                        48: "77716a8abf2afa69744d",
                        49: "455219a68bd1fc5b0b04",
                        50: "1b5be23cf4a0bde1eeeb",
                        51: "bf0d2745592f94e3c980",
                        52: "5710115a3eb01b328c81",
                        53: "6a8daf2344582af190e2",
                        54: "64c7a934d23673df6360",
                        55: "c357f088af9aae0fc28e",
                        56: "aa4abe299e81e5d9adc2"
                    }[e] + ".js"
                }(e);
                var o = new Error;
                t = function(a) {
                    d.onerror = d.onload = null,
                    clearTimeout(b);
                    var c = r[e];
                    if (0 !== c) {
                        if (c) {
                            var f = a && ("load" === a.type ? "missing" : a.type)
                              , t = a && a.target && a.target.src;
                            o.message = "Loading chunk " + e + " failed.\n(" + f + ": " + t + ")",
                            o.name = "ChunkLoadError",
                            o.type = f,
                            o.request = t,
                            c[1](o)
                        }
                        r[e] = void 0
                    }
                }
                ;
                var b = setTimeout(function() {
                    t({
                        type: "timeout",
                        target: d
                    })
                }, 12e4);
                d.onerror = d.onload = t,
                document.head.appendChild(d)
            }
        return Promise.all(a)
    }
    ,
    n.m = e,
    n.c = f,
    n.d = function(e, a, c) {
        n.o(e, a) || Object.defineProperty(e, a, {
            enumerable: !0,
            get: c
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, a) {
        if (1 & a && (e = n(e)),
        8 & a)
            return e;
        if (4 & a && "object" == typeof e && e && e.__esModule)
            return e;
        var c = Object.create(null);
        if (n.r(c),
        Object.defineProperty(c, "default", {
            enumerable: !0,
            value: e
        }),
        2 & a && "string" != typeof e)
            for (var f in e)
                n.d(c, f, (function(a) {
                    return e[a]
                }
                ).bind(null, f));
        return c
    }
    ,
    n.n = function(e) {
        var a = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(a, "a", a),
        a
    }
    ,
    n.o = function(e, a) {
        return Object.prototype.hasOwnProperty.call(e, a)
    }
    ,
    n.p = "/app/",
    n.oe = function(e) {
        throw console.error(e),
        e
    }
    ;
    var d = window.webpackJsonp = window.webpackJsonp || []
      , o = d.push.bind(d);
    d.push = a,
    d = d.slice();
    for (var b = 0; b < d.length; b++)
        a(d[b]);
    var u = o;
    c()
}([]);
load('kScs')

console.log(window.Mddd5)