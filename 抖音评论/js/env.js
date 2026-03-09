/// 补环境代理前缀 --- MY
(() => {
    const origin_log = console.log
    console_log = function () {
        return origin_log(...arguments)
    }
})();;;

!(function () {
    watch = function (obj, name) {
        return new Proxy(obj, {
            get(target, p, receiver) {
                if (name) {
                    if (p === 'Math' || p === 'btoa' || p === 'Number' || p === 'parseFloat' || p == 'String' || p == 'Object' || p == 'Symbol' || p === 'Proxy' || p === "Promise" || p === "Array" || p === "isNaN" || p === "encodeURI" || p === "Uint8Array") {
                        var val = Reflect.get(...arguments)
                        return val
                    } else {
                        var val = Reflect.get(...arguments)
                        if (typeof val === 'function') {
                            console_log('取值: ', name, '.', p, '=> function');
                        } else if (val !== null && typeof val === 'object') {
                            console_log('取值: ', name, '.', p, '=> object');
                        } else {
                            console_log('取值: ', name, '.', p, '=>', val);
                        }
                        return val
                    }
                }
            },
            set(target, p, value, receiver) {
                var val = Reflect.set(...arguments)
                if (typeof value === 'function') {
                    console_log(`设置值为:${name}.${p}=>function`,);
                } else {
                    console_log(`设置值:${name}.${p}=>`, value);
                }
                return val
            }
        })
    }
})()


function makeFunction(name) {
    var func = new Function(`
                return function ${name}(){
                        console_log('参数.${name}',arguments)
                }
                `)();
    safeFunction(func);
    func.prototype = watch(func.prototype, `方法原型${name}.protype`);
    func = watch(func, `方法本身:${name}`);
    return func;
};


(() => {
    Function.prototype.$call = Function.prototype.call;
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('', ')_'));
    const myToString = function toString() {
        return typeof this == 'function' && this[myFunction_toString_symbol] ||
            $toString.$call(this);
    };

    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "weitable": true,
            "value": value
        })
    };

    delete Function.prototype['toString'];
    set_native(Function.prototype, "toString", myToString);
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] } ");

    safeFunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${func.name}(){ [native code] }`)
    }

})();;;


// 1. 解锁
const desc = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
desc.writable = true;
Object.defineProperty(Function.prototype, 'toString', desc);

// 2. 现在可以随便改了
Function.prototype.toString = function () {
    return 'function () { [native code] }';
};
Object.getOwnPropertyDescriptor_ = Object.getOwnPropertyDescriptor;
Object.getOwnPropertyDescriptor = function (target, prop) {
    var val = Object.getOwnPropertyDescriptor_(target, prop);
    val = watch(val, `${prop}描述符`);
    return val;
};
safeFunction(Object.getOwnPropertyDescriptor);

Object.getPrototypeOf_ = Object.getPrototypeOf;
Object.getPrototypeOf = function (target) {
    var val = Object.getPrototypeOf_(target);
    val = watch(val, `getPrototypeOf原型`)
    return val

};
safeFunction(Object.getPrototypeOf);

delete __dirname
delete __filename
delete Buffer
delete process
window = self = top = parent = frames = global
delete globalThis;

XMLHttpRequest = function XMLHttpRequest() {

};  
safeFunction(XMLHttpRequest);
XMLHttpRequest.prototype.send = function () {
    console.log("XMLHttpRequest.prototype.send ===>", ...arguments)
};
safeFunction(XMLHttpRequest.prototype.send);


window.requestAnimationFrame = function () { }
window.XMLHttpRequest = function () { }
window.fetch = function () { }
window.CanvasRenderingContext2D = function () { }
window.HTMLCanvasElement = function () { }
window.openDatabase = function () { }
window.Plugin = function () { }
window.AudioContext = function () { }
window.PluginArray = function () { }
window.TextTrackList = function () { }
window.TouchList = function () { }
window.SVGPointList = function () { }
window.SVGNumberList = function () { }
window.SVGLengthList = function () { }
window.SVGStringList = function () { }
window.SVGTransformList = function () { }
window.SourceBufferList = function () { }
window.StyleSheetList = function () { }
window.TextTrackCueList = function () { }
window.TextTrackList = function () { }
window.CSSRuleList = function () { }
window.CSSStyleDeclaration = function () { }
window.DOMRectList = function () { }
window.DataTransferItemList = function () { }
window.FileList = function () { }
window.HTMLAllCollection = function () { }
window.HTMLCollection = function () { }
window.HTMLFormElement = function () { }
window.HTMLSelectElement = function () { }
window.MediaList = function () { }
window.MimeTypeArray = function () { }
window.NamedNodeMap = function () { }
window.NodeList = function () { }
window.MutationObserver = function () { }
window.WebKitMutationObserver = function () { }
window.dispatchEvent = function () { }
window.innerWidth = 1920,
    window.innerHeight = 150,
    window.outerWidth = 1920,
    window.outerHeight = 1032,
    window.screenX = 0,
    window.screenY = 0,
    window.pageXOffset = 0,
    window.pageYOffset = 0,
    window.availWidth = 1920

window._sdkGlueVersionMap = {
    "sdkGlueVersion": "1.0.0.51",
    "bdmsVersion": "1.0.1.5",
    "captchaVersion": "4.0.2"
}
window.onwheelx = {
    "_Ax": "0X21"
}
head = {}
body = {}
span = {
    classList: function (arg) {
        console.log("span.classList ====>", arg)
    }
}
function addEventListener() {
}
// 模拟的 canvas 对象
const canvastag = {
    tagName: 'CANVAS',
    attributes: {}, // 用于存储属性
    width: 300, // 默认宽度
    height: 150, // 默认高度
    getContext: function (contextType) {
        console.log(`Creating context of type: ${contextType}`);
        if (contextType === '2d') {
            return {
                fillRect: function (x, y, width, height) {
                    console.log(`Drawing rectangle at (${x}, ${y}) with width ${width} and height ${height}`);
                },
                fillText: function (text, x, y) {
                    console.log(`Drawing text "${text}" at (${x}, ${y})`);
                },
                // 可以继续添加更多 2D 绘图方法
            };
        } else if (contextType === 'webgl' || contextType === 'experimental-webgl') {
            return {
                // 最简单的 stub，可按需扩展
                getParameter: function () { return null; },
                createBuffer: function () { return {}; },
                // 新增：让脚本不报错
                getExtension: function (name) {
                    // 常见指纹脚本只关心这两个返回值
                    if (name === 'WEBGL_debug_renderer_info') {
                        // 返回一个对象，上面挂着 UNMASKED_VENDOR_WEBGL / UNMASKED_RENDERER_WEBGL
                        return {
                            UNMASKED_VENDOR_WEBGL: 0x9245,
                            UNMASKED_RENDERER_WEBGL: 0x9246
                        };
                    }else if(name === 'WEBGL_lose_context'){
                        return {
                loseContext:   function () { console.log('[stub] loseContext'); },
                restoreContext:function () { console.log('[stub] restoreContext'); }
            };
                    }

                },

            };
        }
        else if (contextType === 'webgl2') {
            return true;
        } else {
            throw new Error(`Context type "${contextType}" is not supported`);
        }
    },
    toString: function () {
        return `<canvas${Object.keys(this.attributes).map(attr => ` ${attr}="${this.attributes[attr]}"`).join('')}>Your browser does not support the canvas element.</canvas>`;
    }
};

window.addEventListener = addEventListener
document = {
    characterSet: "UTF-8",
    charset: "UTF-8",
    compatMode: "CSS1Compat",
    createElement: function (arg) {
        console.log("document.createElement ====>", arg)
        if (arg === "span") {
            return span
        }else if (val == 'canvas') {
            return canvastag
        }
    },
    documentElement: {},
    createEvent: function createEvent() {
        console.log("document.createElement ====>", arg)
    },
    addEventListener: addEventListener,
    all: {}

}


navigator = {
    webdriver: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
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
        return { isCharging: true }
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
screen = {
    availWidth: 1536,
    availHeight: 912,
    width: 1536,
    height: 960,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: {
        type: "landscape-primary",
        angle: 0
    },
}

location = {
    host: "www.douyin.com",
    hostname: "www.douyin.com",
    pathname: "/user/MS4wLjABAAAAUg6GA31cLhQxV7R8oZ0Xu8TrHKlOml2uaJuLCk5FJJA",
    href: "https://www.douyin.com/user/MS4wLjABAAAAUg6GA31cLhQxV7R8oZ0Xu8TrHKlOml2uaJuLCk5FJJA?modal_id=7329531669432569138&vid=7395661361134472474"
}
setInterval = function () {
};
setTimeout = function () {
};

localStorage = {
    getItem: function (key) {
        console.log("getItem ===>", key)
    },
    setItem: function (key, val) {
        console.log("setItem ===>", key, val)
    },
}
sessionStorage = {
    getItem: function (key) {
        console.log("getItem ===>", key)
    },
    setItem: function (key, val) {
        console.log("setItem ===>", key, val)
    },
}
history = {
    getItem: function (key) {
        console.log("getItem ===>", key)
    },
    setItem: function (key, val) {
        console.log("setItem ===>", key, val)
    },
}
Object.defineProperty(window, Symbol.toStringTag, {
    value: "Window", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});

Object.defineProperty(navigator, Symbol.toStringTag, {
    value: "Navigator", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});

Object.defineProperty(document, Symbol.toStringTag, {
    value: "Document", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});

Object.defineProperty(localStorage, Symbol.toStringTag, {
    value: "Storage", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});

Object.defineProperty(sessionStorage, Symbol.toStringTag, {
    value: "Storage", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});


Object.defineProperty(canvastag, Symbol.toStringTag, {
    value: "HTMLCanvasElement", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
});



window = watch(window, 'window')
location = watch(location, 'location')
document = watch(document, 'document')
screen = watch(screen, 'screen')
navigator = watch(navigator, 'navigator')
localStorage = watch(localStorage, 'localStorage')
history = watch(history, 'history')

function Window() {

}

Object.setPrototypeOf(window, Window)