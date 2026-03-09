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
                            console_log("取值: ", name, "属性", p, "结果=>", 'function')
                        } else {
                            if(name=='window'&& ['window','navigator','clientInformation','location','top','localStorage','document','$_ts','self'].includes(p)){
                                console_log(`取值: `, name, '属性', p, '结果=> 存在')
                            }else {
                                console_log(`取值: `, name, '属性', p, '结果=>', val)
                            }
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

window = self = top = global
location = {
    "ancestorOrigins": {},
    "href": "https://www.nmpa.gov.cn/datasearch/search-result.html",
    "origin": "https://www.nmpa.gov.cn",
    "protocol": "https:",
    "host": "www.nmpa.gov.cn",
    "hostname": "www.nmpa.gov.cn",
    "port": "",
    "pathname": "/datasearch/search-result.html",
    "search": "",
    "hash": ""
}
function HTMLCollection(list) {
    list = list || [];
    for (var i = 0; i < list.length; i++) this[i] = list[i];
    this.length = list.length;
}

HTMLCollection.prototype.item = function (index) {
    return this[index] || null;
};
HTMLCollection.prototype.namedItem = function (id) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id === id) return this[i];
    }
    return null;
};
div = {
    onwheel: null,
    tagName: 'DIV',
    attributes: {}, // 用于存储属性
    innerHTML: '', // 用于存储内容
    setAttribute: function (name, value) {
        this.attributes[name] = value;
    },
    getAttribute: function (name) {
        return this.attributes[name];
    },
    appendChild: function (child) {
        if (typeof this.innerHTML === 'string') {
            this.innerHTML += child;
        } else {
            this.innerHTML = child;
        }
    },
    getElementsByTagName: function (val) {
        console.log("div===>getElementsByTagName", val)
        if (val == 'i') {
            return []
        }
    },
    toString: function () {
        return `<div${Object.keys(this.attributes).map(attr => ` ${attr}="${this.attributes[attr]}"`).join('')}>${this.innerHTML}</div>`;
    }
};
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
                getParameter: function () {
                    return null;
                },
                createBuffer: function () {
                    return {};
                },
                // 新增：让脚本不报错
                getExtension: function (name) {
                    // 常见指纹脚本只关心这两个返回值
                    if (name === 'WEBGL_debug_renderer_info') {
                        // 返回一个对象，上面挂着 UNMASKED_VENDOR_WEBGL / UNMASKED_RENDERER_WEBGL
                        return {
                            UNMASKED_VENDOR_WEBGL: 0x9245,
                            UNMASKED_RENDERER_WEBGL: 0x9246
                        };
                    } else if (name === 'WEBGL_lose_context') {
                        return {
                            loseContext: function () {
                                console.log('[stub] loseContext');
                            },
                            restoreContext: function () {
                                console.log('[stub] restoreContext');
                            }
                        };
                    }

                },

            };
        } else if (contextType === 'webgl2') {
            return true;
        } else {
            throw new Error(`Context type "${contextType}" is not supported`);
        }
    },
    toString: function () {
        return `<canvas${Object.keys(this.attributes).map(attr => ` ${attr}="${this.attributes[attr]}"`).join('')}>Your browser does not support the canvas element.</canvas>`;
    }
};
head_tag = {
    removeChild: function (val) {
        console.log('head_tag==>removeChild====>', val)
    }
}
script = {
    getAttribute: function (val) {
        console.log('script==>getAttribute===>', val)
        if (val == 'r') {
            return 'm'
        }
    },
    parentElement: head_tag
}
meta = {
    getAttribute: function (val) {
        console.log('meta==>getAttribute', val)
        if (val == 'r') {
            return 'm'
        }
    },
    parentNode: head_tag,
    content: 'KcpCJmfCWeEWkBsMe6yncrUW8ONEy7EzbrEq.S.1TbRSajwCqIsjMiftxVvfMk07XdD69rE0NaGVmqHaiOSuQKPWyz0UXvs0'
}
a_tag = {
    pathname: '',
    port: '',
    host: '',
    hostname: '',
    protocol: 'https:',
    href: '',
    search: '',
    hash: '',
};

documentele = []

body = {
    innerHTML: '',
    appendChild: function (val) {
        console.log("body ===>appendChild ===>", val)
        if (tag.tagName === "FORM") {
            window["__Zm9ybS5pZAo__"] = val
        }
        this.innerHTML += val.outerHTML || String(val);
    },
    removeChild: function (element) {
        console.log('Removing:', element);
    },
    // 其他常用方法/属性
    style: {},
    className: '',
    tagName: 'BODY'
}
l1_input = {
    valueOf: function () {
        console.log('l1_input==>valueOf', l1_input)
        return l1_input
    },
    toString: function () {
        console.log('l1_input==>toString', '[object HTMLInputElement]')
        return '[object HTMLInputElement]'
    },
    tagName: 'INPUT',
    'Symbol(Symbol.toPrimitive)':function(hint) {
        switch (hint) {
            case 'number':
                return this.type === 'number' ?
                    parseFloat(this.value) || 0 :
                    NaN;
            case 'string':
                return this.value;
            default:
                return this.value;
        }
    }
}


Object.defineProperty(l1_input, 'Symbol.toStringTag', {
    value: "HTMLInputElement", // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
})
Object.defineProperty(l1_input, 'Symbol(Symbol.toPrimitive)', {
    value: undefined, // 通常浏览器中 window[Symbol.toStringTag] 返回 "Window"
    writable: false,
    enumerable: false,
    configurable: true,
})
l2_input = {
    tagName: 'INPUT'
}
l3_input = {
    tagName: 'INPUT'
}


form = {
    id: '',
    action: '',
    textContent:'',
    innerText:'',
    tagName:"FORM"
}
form_id = '';

Object.defineProperty(form, 'id', {
    get() {
        return l3_input;
    },
    set(ctx) {
        form_id = ctx;
    }
});

form_action = '';
Object.defineProperty(form, 'action', {
    get() {
        return l1_input;
    },
    set(ctx) {
        form_action = ctx;
    }
});

form_textContent = '';

Object.defineProperty(form, 'textContent', {
    get: function () {
        return l2_input;
    },
    set: function (ctx) {
        form_textContent = ctx;
    }
});

form_innerText = '';

Object.defineProperty(form, 'innerText', {
    get: function () {
        return l3_input;
    },
    set: function (ctx) {
        form_innerText = ctx;
    }
});

var input_count = 0
document = {
    visibilityState: "visible",
    addEventListener: addEventListener,
    createElement: function (val) {
        console.log('createElement ===>', val)
        if (val === 'div') {
            return div
        } else if (val == 'canvas') {
            return canvastag
        } else if (val == 'a') {
            return a_tag
        } else if (val == 'form') {
            return form
        } else if (val == 'input') {
            if (input_count == 0) {
                input_count++
                return l1_input
            } else if (input_count == 1) {
                input_count++
                return l2_input
            } else if (input_count == 2) {
                input_count++
                return l3_input
            }

        }
    },
    appendChild: function (val) {
        console.log('document===>appendChild ===>', val)
        if (val.tagName === "FORM") {

            window["__Zm9ybS5pZAo__"] = val
        }
    },
    removeChild: function (val) {
        console.log('document===>removeChild ===>', val)
    },
    getElementById: function (val) {
        console.log('document===>getElementById ===>', val)
        if (val === '8WaRMCSEfLnj') {
            return meta
        }
    },
    documentElement: documentele,
    createEvent: function (val) {
        console.log('createEvent ===>', val)
    },
    querySelector: function (val) {
    },
    getElementsByTagName: function (val) {
        console.log('getElementsByTagName ===>', val)
        if (val == 'script') {
            return [script, script]
        } else if (val == 'base') {
            return []
        }else if(val == 'meta'){
			return meta
		}
    },
    head: head_tag,
    body: body,
    cookie: 'NfBCSins2OywS=609sbeRkDHxXWNVwDahLtup.CuwXk32JuUBcdWsUxXpaOUv6nEsIgYAFq3_vYkGAne90cN54OwRSMmQSS28TFU2G',
    attachEvent: function (val) {
        console.log('document===>attachEvent', val)
    }
}

const v8 = require('v8');
const vm = require('vm');
v8.setFlagsFromString('--allow-natives-syntax');
let undetectable = vm.runInThisContext("%GetUndetectable()");

v8.setFlagsFromString('--no-allow-natives-syntax');
Object.defineProperty(document, 'all', {
    configurable: true,
    enumerable: true,
    value: undetectable,
    writable: true,
})



Object.defineProperty(document.all, 'length', {
    get: function () {
        console.log('document.all.length ------------------------------------->')
        return Object.keys(document.all).length
    }
});

document.all[0] = null;
document.all[1] = null;
document.all[2] = null;
document.all[3] = null;
document.all[4] = null;
document.all[5] = null;

screen = {}

// Error = function () {
// };
//
//
// Error.prototype.stack = "Error\n    at _$e8 (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:31810)\n    at _$ed (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:29783)\n    at _$e8 (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:31911)\n    at _$ed (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:29783)\n    at _$e8 (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:31761)\n    at _$jw (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:38851)\n    at _$e8 (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:32425)\n    at _$ed (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:29783)\n    at _$e8 (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:31761)\n    at Object._$ed [as _$kE] (eval at _$iM (https://www.jscq.com.cn/3of0EhpccaFM/xTa2IIgpXVfp.632fab5.js:166:49), <anonymous>:2:29783)"


mimeType1 = {
    description: "Portable Document Format",
    suffixes: "pdf",
    type: "application/pdf",
}

mimeType2 = {
    description: "Portable Document Format",
    suffixes: "pdf",
    type: "text/pdf",
}
navigator = {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    standalone: undefined,
    MSBlobBuilder: undefined,
    webkitPersistentStorage: {},
    webdriver: false,
    languages: ['zh-CN', 'zh'],
    platform: "MacIntel",
    maxTouchPoints: 0,
    battery: undefined,
    mimeTypes: [mimeType1, mimeType2],
    getBattery: function (val) {
        console.log('navigator==>getBattery', val)
    },
    webkitConnection: function (val) {
        console.log('navigator==>webkitConnection', val)
    },
    mozConnection: function (val) {
        console.log('navigator==>mozConnection', val)
    },
    connection: function (val) {
        console.log('navigator==>connection', val)
    },
    appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}
function LocalStorage(){
    this.store = new Map();
}

LocalStorage.prototype = {
     // 获取值
  getItem(key) {
    console.log("getItem ===>", key);
    return this.store.get(key); // 如果 key 不存在，返回 undefined
  },

  // 设置值
  setItem(key, value) {
    console.log("setItem ===>", key, value);
    this.store.set(key, value);
  },

  // 删除值
  removeItem(key) {
    console.log("removeItem ===>", key);
    this.store.delete(key);
  },

  // 清空所有存储
  clear() {
    console.log("clear ===>");
    this.store.clear();
  },

  // 获取存储的键列表
  keys() {
    return Array.from(this.store.keys());
  }
}
sessionStorage = {
    getItem: function (key) {
        console.log(" sessionStorage getItem ===>", key)
    },
    setItem: function (key, val) {
        console.log("sessionStorage setItem ===>", key, val)
    },
    removeItem: function (key, val) {
        console.log("sessionStorage removeItem ===>", key, val)
    },
}
sessionStorage
history = {
    length: 3,
    scrollRestoration: 'auto',
    state: null,
    replaceState: function (val) {
        console.log('history==>replaceState', val)
    }

}

_$ed = {
    observe: function (val) {
        console.log('_$ed==>observe', val)
        watch(val, '_$ed==>observe')
    }
}

function addEventListener(val) {
    console.log('window===>addEventListener', val)
}

window.indexedDB = {}
window.ActiveXObject = undefined
window.clientInformation = navigator
window.innerHeight = 891
window.innerWidth = 1853
window.outerHeight = 968
window.outerWidth = 1904
window.chrome = {
    "app": {
        "isInstalled": false,
        "InstallState": {
            "DISABLED": "disabled",
            "INSTALLED": "installed",
            "NOT_INSTALLED": "not_installed"
        },
        "RunningState": {
            "CANNOT_RUN": "cannot_run",
            "READY_TO_RUN": "ready_to_run",
            "RUNNING": "running"
        }
    },
    "gptlogin": {
        "HttpMethod": {
            "GET": "GET",
            "POST": "POST"
        }
    },
    "runtime": {
        "ContextType": {
            "BACKGROUND": "BACKGROUND",
            "OFFSCREEN_DOCUMENT": "OFFSCREEN_DOCUMENT",
            "POPUP": "POPUP",
            "SIDE_PANEL": "SIDE_PANEL",
            "TAB": "TAB"
        },
        "OnInstalledReason": {
            "CHROME_UPDATE": "chrome_update",
            "INSTALL": "install",
            "SHARED_MODULE_UPDATE": "shared_module_update",
            "UPDATE": "update"
        },
        "OnRestartRequiredReason": {
            "APP_UPDATE": "app_update",
            "OS_UPDATE": "os_update",
            "PERIODIC": "periodic"
        },
        "PlatformArch": {
            "ARM": "arm",
            "ARM64": "arm64",
            "MIPS": "mips",
            "MIPS64": "mips64",
            "X86_32": "x86-32",
            "X86_64": "x86-64"
        },
        "PlatformNaclArch": {
            "ARM": "arm",
            "MIPS": "mips",
            "MIPS64": "mips64",
            "X86_32": "x86-32",
            "X86_64": "x86-64"
        },
        "PlatformOs": {
            "ANDROID": "android",
            "CROS": "cros",
            "FUCHSIA": "fuchsia",
            "LINUX": "linux",
            "MAC": "mac",
            "OPENBSD": "openbsd",
            "WIN": "win"
        },
        "RequestUpdateCheckStatus": {
            "NO_UPDATE": "no_update",
            "THROTTLED": "throttled",
            "UPDATE_AVAILABLE": "update_available"
        }
    }
}
window.addEventListener = addEventListener
window.name = '$_YWTU=mQ9_g5PsmBOA60Xx9CSifPI83vWHIsSDQvJe54v9Hgl&$_YVTX=Wsl&vdFm='

function MutationObserver(val) {

    return _$ed
}

function WebKitMutationObserver() {

}

MutationObserver.prototype.observe = function (val) {
    console.log('MutationObserver==>observe', val)
}

WebKitMutationObserver.prototype.observe = function (val) {
    console.log('WebKitMutationObserver==>observe', val)
}

window.CanvasRenderingContext2D = function (val) {
    console.log('window==>CanvasRenderingContext2D', val)
}
window.HTMLCanvasElement = function (val) {
    console.log('window==>HTMLCanvasElement', val)
}
window.DOMParser = function (val) {
    console.log('window==>DOMParser', val)
}

// 2. 添加属性（可配置）
Object.defineProperty(window, 'webkitRequestFileSystem', {
    value: function (val) {
        console.log('window.webkitRequestFileSystem called with:', val);
    },
    configurable: true, // 允许删除
});
//
window.webkitRequestFileSystem = function (val) {
    console.log('window==>webkitRequestFileSystem', val)
}

window.DOMParser = function (val) {
    console.log('window==>DOMParser', val)
}

window.XMLHttpRequest = function (val) {
    console.log('window==>XMLHttpRequest', val)
}
window.HTMLFormElement = function (val){
	console.log('window==>HTMLFormElement', val)
}

window.setInterval = function (val) {
    // console.log('window==>setInterval',val)
    // return _$ed
}

window.setTimeout = function (val) {
    // console.log('window==>setTimeout',val)
    // return _$ed
}
window.TEMPORARY = 0
window = watch(window, 'window')

location = watch(location, 'location')
document = watch(document, 'document')
screen = watch(screen, 'screen')
navigator = watch(navigator, 'navigator')
localStorage = watch(new LocalStorage(), 'localStorage')
history = watch(history, 'history')
script = watch(script, 'script')
meta = watch(meta, 'meta')
head_tag = watch(head_tag, 'head_tag')
documentele = watch(documentele, 'documentele')
sessionStorage = watch(sessionStorage, 'sessionStorage')
_$ed = watch(_$ed, '_$ed')
body = watch(body, 'body')
a_tag = watch(a_tag, 'a_tag')
form = watch(form, 'form')
l1_input = watch(l1_input, 'l1_input')
l2_input = watch(l2_input, 'l2_input')
l3_input = watch(l3_input, 'l3_input')
mimeType1 = watch(mimeType1, 'mimeType1')
mimeType2 = watch(mimeType2, 'mimeType2')
