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
                                console_log(`取值: `, name, '属性', p, '结果=>')
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
    "href": "http://www.dce.com.cn/dce/channel/list/1018.html",
    "origin": "http://www.dce.com.cn",
    "protocol": "http:",
    "host": "www.dce.com.cn",
    "hostname": "www.dce.com.cn",
    "port": "",
    "pathname": "/dce/channel/list/1018.html",
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
    content:'y0D4A3COSWbz.KIF_ntMzfBytQTPR4C8bvV18yHhudnkJ9n.OM7NjkLc6CmjoFNdyfO0yBoccaN1ipBzfhsq3y3HdWgErKoO3TJP77fIge3Hv9d_PdVnyplUsq0NHMYy'
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
        }
    },
    head: head_tag,
    body: body,
    cookie:'hNUS9DnJtejwS=60uFloraNJ9chbKHOTw_q.YdHZR0XMwnxDUPJ4OHutp0lfaQMmezsCgUZWBhwTILSvgVqdndSjVdqnAc6VEErhIG',
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
localStorage = {
    getItem: function (key) {
        console.log("getItem ===>", key)
        // if (key == '_$rc') {
        //     return 'brgXd0Pgjodwf4ABxo8gZWMhhiE9MgjqB7FDx7d3IhDrszDiBVKJn9xFnhkXsFyLHld6Ri7oifoteOPdwj69TJVcEumnlmzcbb.se6lgRLees6ONfzD4fVQazc93lXA3C1WHZLFCG0nHkfylwXNSHOW7Qafs6Gs_jsLYLw6YjD_OyEONcEz8INUS6M90ugZLVFMEmd_gnKeTRxtxY1YfxWu4BmnzgqYTmT4kuE.du2r8zj3J6LqHkalIkH3vA_KAf_PkkpcIbfX9eVIW_HEUOMJ6CZiGJnydJW.RmOBwa.CjkC561wp6hjQPfCxyfik741JwN4F9bFdVX6wtpBHcyyWtmi3AFkwCIKaikrNPhcrOc4GuNteiS_KdWMdNHcrH1_MD5K.jHVITu33iP5VsARvrpQfezS.Lz34FUhQ6mqLg7gdPxLXOLtJ8HBFEyhypLT37B7nb50UdYjsH7TFTRYkGIC7B9_zQ_8uPMVVZpBJEuQQ5AM9aofjAMnPsokFjxz13eRt7gybEA8E6MSRkNvjEoqHBFL9DzYKodMOe_fsedXDm6wpI5kWppbW.pUJAAUNkoVnpDB.MG878fa_DvlT3_rQPSTupR8ptcutNaCSnMiweTB9khVJYeSk5YsDY8F2t_uXDpNSTAUmprYkfpQp5V.RT2NuLOnhzZ6DlbsCBFnXARG2NuDXX7SWhThpmpFXW9BJX6u3qne78_9DV7mhGeQf1AHysjDx4afyUtSIe3KCnJfMJjRnGA9A'
        // } else if (key == '$_YVTX') {
        //     return 'WsGy'
        // }
    },
    setItem: function (key, val) {
        console.log("setItem ===>", key, val)
    },
    removeItem: function (key, val) {
        console.log("removeItem ===>", key, val)
    },
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

window.clientInformation = navigator
window.innerHeight = 890
window.innerWidth = 1869
window.outerHeight = 967
window.outerWidth = 1920
window.outerWidth = 1920

window.addEventListener = addEventListener
window.name = '&$_YWTU=sFbuhlpds7m1GV0riGXVpXlExfksgr5oAfqu9RVuvwZ&$_YVTX=JG'

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

window.XMLHttpRequest = function (val) {
    console.log('window==>XMLHttpRequest', val)
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
window.ActiveXObject = undefined
window = watch(window, 'window')

location = watch(location, 'location')
document = watch(document, 'document')
screen = watch(screen, 'screen')
navigator = watch(navigator, 'navigator')
localStorage = watch(localStorage, 'localStorage')
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
