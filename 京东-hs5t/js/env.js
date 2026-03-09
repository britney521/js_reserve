

// console.log = function (){
//
// };

/// 补环境代理前缀 --- MY
(() => {
    const origin_log = console.log
    console_log = function () {
        return origin_log(...arguments)
    }
})();
;
;

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
                            console_log('取值: ', name, '.', p, '=>', 'function');
                        } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                            console_log('取值: ', name, '.', p, '=>', 'object');
                        } else {
                            console_log('取值: ', name, '.', p, '=>', val);
                        }

                        return val;
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

})();
;
;


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
// ========================================================================
// 1. 基础原型链构建工具 (用于构建 EventTarget -> Node -> Element 继承关系)
// ========================================================================
var _constructors = {}; // 存储构造函数引用

function createInterface(name, parent, props) {
    var func = function () {
        // 允许构造函数被 new 调用，同时也支持非法调用检测
    };
    // 保护函数 toString
    Object.defineProperty(func, "name", {value: name, configurable: true});
    safeFunction(func);

    // 设置继承关系
    if (parent) {
        func.prototype = Object.create(parent.prototype);
        func.prototype.constructor = func;
        Object.setPrototypeOf(func, parent); // 静态属性继承
    }

    // 挂载原型方法/属性
    if (props) {
        for (var key in props) {
            func.prototype[key] = props[key];
        }
    }

    // 挂载到 window 和内部缓存
    _constructors[name] = func;
    // window[name] = func; // 最后统一挂载
    return func;
}


delete __dirname
delete __filename
delete Buffer
delete process;
window = self = top = parent = frames = global


// ========================================================================
// 2. 核心 DOM 类定义 (修复原型链缺失)
// ========================================================================

// 2.1 EventTarget
var EventTarget = createInterface("EventTarget", null, {
    addEventListener: function (type, listener) {
        // console_log('[EventTarget] addEventListener:', type);
    },
    removeEventListener: function () {
    },
    dispatchEvent: function () {
        return true;
    }
});

// 2.2 Node
// 更新 Node 定义 (请替换或合并之前的 Node 定义)
var Node = createInterface("Node", EventTarget, {
    appendChild: function (child) {
        // 模拟节点挂载，修改子节点的 parentNode 指向当前节点
        child.parentNode = this;
        return child;
    },
    removeChild: function (child) {
        child.parentNode = null;
        return child;
    },
    // 关键：默认 parentNode 是 null
    parentNode: null,
    childNodes: []
});

// 补全 globalThis
window.globalThis = window;

// 2.3 Element
var Element = createInterface("Element", Node, {
    getElementsByTagName: function (tagName) {
        console_log('[Element] getElementsByTagName:', tagName);
        return new HTMLCollection();
    },
    getAttribute: function (name) {
        return null;
    },
    setAttribute: function (name, value) {
    }
});

// 2.4 HTMLElement (JD检测重点：style属性)
var HTMLElement = createInterface("HTMLElement", Element, {
    get style() {
        return watch({}, 'style'); // style 也是个对象
    }
});


// ========================================================================
// 3. 具体 HTML 元素定义 (修复你原代码中 未定义先使用 的问题)
// ========================================================================

var HTMLHtmlElement = createInterface("HTMLHtmlElement", HTMLElement);
var HTMLHeadElement = createInterface("HTMLHeadElement", HTMLElement);
var HTMLBodyElement = createInterface("HTMLBodyElement", HTMLElement);
// 定义 HTMLScriptElement
var HTMLScriptElement = createInterface("HTMLScriptElement", HTMLElement, {
    src: "",
    type: "",
    text: "",
    // 模拟 script 加载完成后的回调
    set src(val) {
        console_log('[HTMLScriptElement] 设置 src:', val);
        this._src = val;
        // 关键：京东的 rac.js 加载后会触发 load 事件
        // 这里我们要模拟异步加载成功
        var self = this;
        setTimeout(function () {
            if (self.onload) {
                console_log('[HTMLScriptElement] 触发 onload:', val);
                self.onload();
            }
        }, 100);
        return val;
    },
    get src() {
        return this._src || "";
    }
});
var HTMLDivElement = createInterface("HTMLDivElement", HTMLElement);
var HTMLAnchorElement = createInterface("HTMLAnchorElement", HTMLElement); // 用于解析 URL


var HTMLFormElement = createInterface("HTMLFormElement", HTMLElement);
var HTMLSelectElement = createInterface("HTMLSelectElement", HTMLElement);
var HTMLInputElement = createInterface("HTMLInputElement", HTMLElement);
var HTMLImageElement = createInterface("HTMLImageElement", HTMLElement); // Image 继承自它


// 3.1 重点：Canvas 指纹模拟 (HTMLCanvasElement & Context)
// JD 算法非常依赖 Canvas 指纹
var CanvasRenderingContext2D = createInterface("CanvasRenderingContext2D", null, {
    // 模拟常用绘图方法，防止报错，并记录调用
    fillText: function (text, x, y) {
    },
    fillRect: function (x, y, w, h) {
    },
    stroke: function () {
    },
    arc: function () {
    },
    beginPath: function () {
    },
    closePath: function () {
    }
});
// 1. 模拟 WebGL 上下文
var WebGLRenderingContext = createInterface("WebGLRenderingContext", null, {
    getParameter: function (p) {
        // console_log('[WebGL] getParameter:', p);
        // 模拟常见显卡参数
        if (p === 37445) return "Google Inc. (Intel)"; // UNMASKED_VENDOR_WEBGL
        if (p === 37446) return "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)"; // UNMASKED_RENDERER_WEBGL
        if (p === 7937) return "WebKit";
        if (p === 35724) return "WebGL 1.0 (OpenGL ES 2.0 Chromium)";
        return null;
    },
    getExtension: function (name) {
        // console_log('[WebGL] getExtension:', name);
        if (name === "WEBGL_debug_renderer_info") {
            return {
                UNMASKED_VENDOR_WEBGL: 37445,
                UNMASKED_RENDERER_WEBGL: 37446
            };
        }
        return null;
    },
    createBuffer: function () {
        return {};
    },
    bindBuffer: function () {
    },
    bufferData: function () {
    },
    enable: function () {
    },
    clearColor: function () {
    },
    clear: function () {
    },
    viewport: function () {
    },
    createShader: function () {
    },
    createProgram: function () {
    },
    linkProgram: function () {
    },
    shaderSource: function () {
    },
    compileShader: function () {
    },
    getShaderParameter: function () {
        return true;
    },
    getProgramParameter: function () {
        return true;
    },
    attachShader: function () {
    },
    useProgram: function () {
    },
    getAttribLocation: function () {
        return 0;
    },
    getUniformLocation: function () {
        return {};
    },
    enableVertexAttribArray: function () {
    },
    vertexAttribPointer: function () {
    },
    drawArrays: function () {
    },
    getSupportedExtensions: function () {
        return ["WEBGL_debug_renderer_info"];
    }
});

var WebGL2RenderingContext = createInterface("WebGL2RenderingContext", null);

var HTMLCanvasElement = createInterface("HTMLCanvasElement", HTMLElement, {
    getContext: function (type) {
        console_log('[Canvas] getContext type:', type);
        if (type === '2d') {
            return watch(new CanvasRenderingContext2D(), 'CanvasContext2D');
        }
        if (type === 'webgl' || type === 'experimental-webgl') {
            return watch(new WebGLRenderingContext(), 'WebGLContext');
        }
        return null;
    },
    toDataURL: function () {
        console_log('[Canvas] toDataURL 调用 - 正在生成假指纹');
        // 返回一个固定的 Base64，模拟空白或特定图像的指纹
        return 'data:image/png;base64,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';
    }
});

// ========================================================================
// 4. 集合类定义 (HTMLCollection, NodeList)
// ========================================================================

var HTMLCollection = createInterface("HTMLCollection", null, {
    length: 0,
    item: function (index) {
        return null;
    }
});
// 模拟 arguments 迭代器
HTMLCollection.prototype[Symbol.iterator] = function* () {
    yield* [];
};

// 使用 Proxy 让 document.all 支持 document.all[0] 和 document.all['head']
function createDocumentAllProxy() {
    var allImpl = new HTMLAllCollection();
    // 硬编码一个较大的长度，欺骗长度检测
    Object.defineProperty(allImpl, 'length', {value: 680, writable: true});

    return new Proxy(allImpl, {
        get: function (target, p, receiver) {
            if (p === 'length') return target.length;
            if (typeof p === 'string' && !isNaN(p)) {
                // 索引访问 document.all[0]
                return new HTMLDivElement();
            }
            // 属性访问 document.all['head']
            if (p === 'head') return document.head;
            if (p === 'body') return document.body;

            return Reflect.get(target, p, receiver) || new HTMLDivElement();
        }
    });
}

var HTMLAllCollection = createInterface("HTMLAllCollection", null, {
    // 模拟 item 方法
    item: function (indexOrName) {
        // 简单返回一个兜底元素，防止报错
        return new HTMLDivElement();
    },
    namedItem: function (name) {
        return new HTMLDivElement();
    }
});

// ========================================================================
// 5. HTMLDocument 定义 (补全 cookie 和创建元素逻辑)
// ========================================================================

var Document = createInterface("Document", Node, {
    getElementById: function (id) {
        // console_log('getElementById:', id);
        return null;
    },
    createEvent: function (type) {
        // console_log('createEvent:', type);
        return {
            initEvent: function () {
            }
        };
    }
});
location = {
    "ancestorOrigins": {},
    "href": "https://search.jd.com/Search?keyword=%E8%8B%B9%E6%9E%9C%E6%89%8B%E6%9C%BA&enc=utf-8&suggest=1.his.0.0&wq=&pvid=8bcc8712e18f4438ae398f3141a4332c&spmTag=YTAyMTkuYjAwMjM1Ni5jMDAwMDQ2ODkuMSUyM2hpc2tleXdvcmQ",
    "origin": "https://search.jd.com",
    "protocol": "https:",
    "host": "search.jd.com",
    "hostname": "search.jd.com",
    "port": "",
    "pathname": "/Search",
    "search": "?keyword=%E8%8B%B9%E6%9E%9C%E6%89%8B%E6%9C%BA&enc=utf-8&suggest=1.his.0.0&wq=&pvid=8bcc8712e18f4438ae398f3141a4332c&spmTag=YTAyMTkuYjAwMjM1Ni5jMDAwMDQ2ODkuMSUyM2hpc2tleXdvcmQ",
    "hash": ""
}
// 真正的 HTMLDocument
var HTMLDocument = createInterface("HTMLDocument", Document, {
    _cookie: '__jdu=866395081; shshshfpa=5dca2291-e9ab-b2da-182d-e0cd7bc31d0a-1754113913; shshshfpx=5dca2291-e9ab-b2da-182d-e0cd7bc31d0a-1754113913; o2State=; ipLoc-djd=17-1413-1419-7573; unpl=JF8EAK1nNSttWBtSAB0LG0UZHApcW1lcTx8Eam4HXQkIHFIBHQYSGxl7XlVdWhRKFx9uYRRUXVNKUw4YAisSEXteXVdZDEsWC2tXVgQFDQ8VXURJQlZAFDNVCV9dSRZRZjJWBFtdT1xWSAYYRRMfDlAKDlhCR1FpMjVkXlh7VAQrCxwVEkNZVVddOEonBF9XNVxbW0NSNRoyGiJSHwFdW1sNShROZmACVlVcSl0FKwMrEQ; ceshi3.com=000; __jdv=76161171|direct|-|none|-|1769496347059; pinId=gvQawxjIPgUvjhqS8bBPVg; pin=jd_zxShWITEdVnI; unick=29lx70qtam7wu0; _tp=OKy7sEn2QhiArHzdyBpblg%3D%3D; mail_times=4%2C1%2C1769564868906; PCSYCityID=CN_420000_421000_0; umc_count=1; cid=9; mba_muid=866395081; wlfstk_smdl=ltu8ppxrb1ugc5cutdaxb4f1zll81jen; TrackID=1ZuVRvgLN7-EgGXQFNKR8XbaJlQQw4Ue-sSgA1ys5A2Ios3p6eTfExDlz8ov7lylJdRTGkH9wGbN_ZGYrMhrz4Nbb1s8Ua7RYivyej_RLJEFauzFcR1qbTXWGBIxT3hNY; __jdc=143920055; __jda=143920055.866395081.1754113909.1769575202.1769578230.44; 3AB9D23F7A4B3CSS=jdd03OPC5DL7KBFI2FMD7W2AI6JYVAQAKICJJ7F4KR22FZ5SSHYMQC65RMUK5HAO7PI7SEH5CA3G4VR6FZMUP77DODBRME4AAAAM4AMXEOBAAAAAADFXKS35OKSZL5AX; 3AB9D23F7A4B3C9B=OPC5DL7KBFI2FMD7W2AI6JYVAQAKICJJ7F4KR22FZ5SSHYMQC65RMUK5HAO7PI7SEH5CA3G4VR6FZMUP77DODBRME4; shshshfpb=BApXWOMwnAPlAPIyBG-xcbqrkibrABazQBhZQPjxj9xJ1PdZfQpzOoRLcpR_fN7B9WqqfW6nnsaxlf-o866tY594vMlzhpqV0EwM',
    createElement: function (tagName) {
        tagName = tagName.toLowerCase();
        if (tagName === 'div') return watch(new HTMLDivElement(), 'div');
        if (tagName === 'script') {
            var script = new HTMLScriptElement();
            // 刚创建的元素 parentNode 必须是 null
            script.parentNode = null;
            return watch(script, 'script');
        }
        ;
        if (tagName === 'canvas') return watch(new HTMLCanvasElement(), 'canvas');
        if (tagName === 'head') return watch(new HTMLHeadElement(), 'head');
        if (tagName === 'body') return watch(new HTMLBodyElement(), 'body');
        if (tagName === 'a') return watch(new HTMLAnchorElement(), 'a');
        return watch(new HTMLElement(), tagName); // 默认兜底
    },
    getElementsByTagName: function (tagName) {
        if (tagName === 'head') return watch(new HTMLCollection(), 'head_collection');
        if (tagName === 'script') return watch(new HTMLCollection(), 'script_collection');
        return new HTMLCollection();
    },
    write: function (content) {
    },
    // Cookie 模拟
    get cookie() {
        return this._cookie || "";
    },
    set cookie(val) {
        // 简单模拟 cookie 设置逻辑
        var parts = val.split(';');
        var kv = parts[0].split('=');
        if (!this._cookie) this._cookie = "";
        this._cookie += (this._cookie ? "; " : "") + val;
        console_log('Set Cookie:', val);
    },
    // 常用属性
    get body() {
        return new HTMLBodyElement();
    },
    get head() {
        return new HTMLHeadElement();
    },
    get documentElement() {
        return new HTMLHtmlElement();
    },
    get all() {
        return watch(createDocumentAllProxy(), 'document.all');
    },
    get referrer() {
        return "";
    }, // 或者是 jd 的上级页面
    location: location // 循环引用
});

// ========================================================================
// 6. Navigator 插件与环境模拟 (PluginArray, MimeTypeArray)
// ========================================================================

function MimeType(type, suffix, desc, plugin) {
    this.type = type;
    this.suffixes = suffix;
    this.description = desc;
    this.enabledPlugin = plugin;
}

safeFunction(MimeType);

function Plugin(name, desc, filename) {
    this.name = name;
    this.description = desc;
    this.filename = filename;
    this.length = 0;
}

safeFunction(Plugin);

// 构建假插件数据 (模拟 Chrome PDF 插件等)
var pdfPlugin = new Plugin("Chrome PDF Plugin", "Portable Document Format", "internal-pdf-viewer");
var pdfMime = new MimeType("application/x-google-chrome-pdf", "pdf", "Portable Document Format", pdfPlugin);

var PluginArray = createInterface("PluginArray", null, {
    length: 1,
    0: pdfPlugin,
    item: function (i) {
        return this[i];
    },
    namedItem: function (name) {
        return this[0];
    },
    refresh: function () {
    }
});
var MimeTypeArray = createInterface("MimeTypeArray", null, {
    length: 1,
    0: pdfMime,
    item: function (i) {
        return this[i];
    },
    namedItem: function (name) {
        return this[0];
    }
});

var Navigator = createInterface("Navigator", null, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    appCodeName: "Mozilla",
    appName: "Netscape",
    platform: "Win32",
    product: "Gecko",
    vendor: "Google Inc.",
    language: "zh-CN",
    languages: ["zh-CN", "en"],
    hardwareConcurrency: 12,
    deviceMemory: 8,
    webdriver: false,
    plugins: new PluginArray(),
    mimeTypes: new MimeTypeArray(),
    javaEnabled: function () {
        return false;
    },
    getBattery: function () {
        return Promise.resolve({charging: true, level: 1});
    }
});
// 修正 Plugin 的挂载 (你之前定义了 Plugin 函数，但可能没挂载到 window)
window.Plugin = Plugin;
window.PluginArray = PluginArray;
window.MimeType = MimeType;
window.MimeTypeArray = MimeTypeArray;

// ========================================================================
// 7. Screen & Window 补充
// ========================================================================

var Screen = createInterface("Screen", null, {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24
});


var Window = createInterface("Window", EventTarget, {
    // 模拟 Image 对象 (new Image())
    Image: function () {
        return new HTMLCanvasElement();
    }, // Image 其实和 HTMLImageElement 类似
    setTimeout: function (fn) {
        try {
            fn()
        } catch (e) {
        }
        return 1;
    },
    setInterval: function () {
        return 1;
    },
    clearTimeout: function () {
    },
    clearInterval: function () {
    },

    // JD 可能会检测 Chrome 对象
    chrome: {runtime: {}}
});
safeFunction(Window.prototype.Image);

localStorage = {
    getItem: function (k) {
        console.log('localStorage==>getItem',k)
        if(k == 'WQ_dy1_vk'){
            return {"5.2":{"73806":{"e":31536000,"v":"tt9ag3twihdh06d3","t":1754182048415},"f06cc":{"e":31536000,"v":"mg99z3t6mqpjpqp1","t":1754182049097},"fb5df":{"e":31536000,"v":"mmwm63igzq6pqdd0","t":1754199282041}}}
        }else if(k =='WQ_dy1_tk_algo'){
            return {}
        }
        else if(k =='JDst_behavior_flag'){
            return [{"t":1769592979903,"e":3600,"v":"Fn"}]
        }
        else if(k =='JDst_behavior_flag'){
            return [{"t":1769592979903,"e":3600,"v":"Fn"}]
        }
        else if(k =='WQ_gather_cv1'){
            return {"v":"487f7b22f68312d2c1bbc93b1aea445b","t":1769592867513,"e":31536000}
        }
        else if(k =='WQ_gather_wgl1'){
            return {"v":"487f7b22f68312d2c1bbc93b1aea445b","t":1769592867517,"e":31536000}
        }


    },
    setItem: function (k, v) {
    },
    removeItem: function (k) {
    }
}
    sessionStorage = {
        getItem: function (k) {
            return null
        },
        setItem: function (k, v) {
        },
        removeItem: function (k) {
        }
    }
var CSSStyleDeclaration = createInterface("CSSStyleDeclaration", null);
var CSSRuleList = createInterface("CSSRuleList", null);
var MediaList = createInterface("MediaList", null);
var StyleSheetList = createInterface("StyleSheetList", null);
var DOMStringList = createInterface("DOMStringList", null);
var DOMTokenList = createInterface("DOMTokenList", null);

window.CSSStyleDeclaration = CSSStyleDeclaration;
window.CSSRuleList = CSSRuleList;
window.MediaList = MediaList;
window.StyleSheetList = StyleSheetList;
window.DOMStringList = DOMStringList;
window.DOMTokenList = DOMTokenList;

var Performance = createInterface("Performance", EventTarget, {
    now: function () {
        // 模拟高精度时间，使用 node 的 process.hrtime
        if (typeof process !== 'undefined' && process.hrtime) {
            var hr = process.hrtime();
            return (hr[0] * 1000 + hr[1] / 1e6);
        }
        return new Date().getTime();
    },
    getEntries: function () {
        return [];
    },
    memory: {
        jsHeapSizeLimit: 2172649472,
        totalJSHeapSize: 11000000,
        usedJSHeapSize: 10000000
    }
});
window.performance = watch(new Performance(), 'performance');

// ========================================================================
// 补丁：XMLHttpRequest
// ========================================================================
var XMLHttpRequest = createInterface("XMLHttpRequest", EventTarget, {
    open: function (method, url) {
        // console_log('[XHR] open:', method, url);
    },
    send: function (data) {
        // console_log('[XHR] send');
    },
    setRequestHeader: function (k, v) {
    },
    getAllResponseHeaders: function () {
        return "";
    },
    getResponseHeader: function (k) {
        return null;
    },
    abort: function () {
    },
    readyState: 0,
    status: 200,
    responseText: "",
    responseXML: null,
    withCredentials: false
});
// 挂载到 window
window.XMLHttpRequest = XMLHttpRequest;
// ========================================================================
// 8. 实例化与环境挂载 (Assemble)
// ========================================================================
window.outerWidth = 1920;
window.outerHeight = 1040;
window.innerWidth = 1920;
window.innerHeight = 969; // 去掉工具栏的高度
window.devicePixelRatio = 1.25; // 常见的缩放比
// 实例化
document = new HTMLDocument();
navigator = new Navigator();
screen = new Screen();

chrome = Window.prototype.chrome;
navigator.appVersion = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";
navigator.vendor = "Google Inc.";
navigator.product = "Gecko";

var MutationObserver = function (callback) {
    this.callback = callback;
};
safeFunction(MutationObserver);
MutationObserver.prototype = {
    observe: function (target, options) {
        // console_log('[MutationObserver] observe:', target);
    },
    disconnect: function () {
    },
    takeRecords: function () {
        return [];
    }
};
Object.defineProperty(MutationObserver.prototype, "constructor", {value: MutationObserver});
window.MutationObserver = MutationObserver;
window.WebKitMutationObserver = MutationObserver; // 兼容老版本
// 挂载构造函数到 window (模拟全局类)
for (var key in _constructors) {
    window[key] = _constructors[key];
}

// 修正 window 原型链
Object.setPrototypeOf(window, Window.prototype);

// 定义模拟的 Crypto 类
var Crypto = createInterface("Crypto", null, {
    getRandomValues: function (buffer) {
        // console_log('[Crypto] getRandomValues 调用');
        // 简单模拟随机数填充
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    }
});

// 关键操作：先删除 Node 环境自带的 crypto 属性
// 这一步至关重要，否则后续的赋值可能无法覆盖原生的 getter
try {
    delete global.crypto;
    delete window.crypto;
} catch (e) {
    console_log("删除原生 crypto 失败", e);
}
// 记得在最后实例化时应用
document = new HTMLDocument();

document.referrer = 'https://passport.jd.com/'
// 重新挂载 document.all
HTMLDocument.prototype.all = document.all;
// 实例化并挂载
// 使用 Object.defineProperty 强制写入，确保没有 getter 残留
var myCrypto = watch(new Crypto(), 'crypto');

Object.defineProperty(global, 'crypto', {
    value: myCrypto,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'crypto', {
    value: myCrypto,
    writable: true,
    enumerable: true,
    configurable: true
});

// 确保 Crypto 构造函数也在 window 上
window.Crypto = Crypto;
window.window === window
// 最终代理
window = watch(window, 'window');
document = watch(document, 'document');
location = watch(location, 'location');
navigator = watch(navigator, 'navigator');
screen = watch(screen, 'screen');
localStorage = watch(localStorage, 'localStorage');
sessionStorage = watch(sessionStorage, 'sessionStorage');



