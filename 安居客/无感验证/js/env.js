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

delete __dirname
delete __filename
delete Buffer
delete process
window = self = top = parent = frames = global
delete globalThis;

div = {
    addEventListener:function (){

    },
    getAttribute:function (arg){

    }
}
function addEventListener(arg){
    console.log('addEventListener =>',arg)

}
window.CanvasRenderingContext2D = function (){

}

window.addEventListener = addEventListener
location = {
    protocol:"https:",
    hostname:"callback.58.com",
}
screen = {}
localStorage = {}
history = {}

document = {
    cookie:'__snaker__id=nKBrbNcLwtCvrSR3; xxzlxxid=pfmxAd5pZDj7NsYYo7ApFWE0cfvcZ/pfiX0ShV9+UwaHp0M6FfhEi+pq3qFEpXgloPwt; id58=CroOlGlP2jEL/02nItgiAg==; gdxidpyhxdE=G5UJk0CahtWP4jIxXTjUddsIY1LwCCShDdd77HtW39BGPGig7pAjz%2F9urItUfSnq%2BMJRj%5CYJGE6fvKEkqTbhYstWB%2FB1VlpxkhtYsvXM5CWHLq9YCgfyU0EqPxQbbB62hIXz%2FbYKUKa9r7XaN6Iw5ZDo5VOmhBzp1u4amolyLZiUl6Qm%3A1766892004933',
    createElement:function (arg){
        console.log("document =>createElement",arg)
        return div
    },
     createEvent:function (arg){
        console.log("document =>createEvent",arg)
    },
    addEventListener:addEventListener,
    body:'',
    documentElement:'',
    getElementById:function (arg){
        console.log('document =>getElementById',arg)
    },
}
navigator = {
    userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    maxTouchPoints:0,
    msMaxTouchPoints:undefined,
    documentElement:'',
    compatMode:'CSS1Compat',
}

window = watch(window, 'window')
location = watch(location, 'location')
document = watch(document, 'document')
screen = watch(screen, 'screen')
navigator = watch(navigator, 'navigator')
localStorage = watch(localStorage, 'localStorage')
history = watch(history, 'history')

function Window(){

}

Object.setPrototypeOf(window, Window)
var a = window.__proto__ ? null : undefined