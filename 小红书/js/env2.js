function watch(object) {
  const handler = {
    get: function (target, property, receiver) {
      if (property !== 'isNaN' && property !== 'encodeURI' && property !== "Uint8Array" && property !== 'undefined' && property !== 'JSON') {
        console.log("方法:", "get", "对象", target, "属性:",
          property, "属性类型:", typeof property, "属性值:", target[property], "属性值类型:", typeof target[property]);
      }
      return Reflect.get(...arguments)

    },
    set: function (target, property, value, receiver) {
      console.log("方法:", "set", "对象:", target, "属性:",
        property, "属性类型:", typeof property, "属性值:", value, "属性值类型:", typeof target[property]);
      return Reflect.set(...arguments);
    }
  }
  return object
  return new Proxy(object, handler)
}
const safeFunction = function safeFunction(func) {
  //处理安全函数
  Function.prototype.$call = Function.prototype.call;
  const $toString = Function.toString;
  const myFunction_toString_symbol = Symbol('('.concat('', ')'));

  const myToString = function myToString() {
    return typeof this === 'function' && this[myFunction_toString_symbol] || $toString.$call(this);
  }

  const set_native = function set_native(func, key, value) {
    Object.defineProperty(func, key, {
      "enumerable": false,
      "configurable": true,
      "writable": true,
      "value": value
    });
  }

  delete Function.prototype['toString'];
  set_native(Function.prototype, "toString", myToString);
  set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }");

  const safe_Function = function safe_Function(func) {
    set_native(func, myFunction_toString_symbol, "function" + (func.name ? " " + func.name : "") + "() { [native code] }");
  }

  return safe_Function(func)
}


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
// window.Permissions = function Permissions() { }
// window.NavigatorUAData = function NavigatorUAData() { }
// window.Element = function Element() { }
// window.HTMLAllCollection = function HTMLAllCollection() {
//   this.length = 1048
// }
//
// window.HTMLElement = function HTMLElement() {
//   Element.call(this)
// }
//
// window.HTMLBodyElement = function HTMLBodyElement() {
//   HTMLElement.call(this)
//   this.tagName = 'BODY'
// }
//
// window.HTMLHtmlElement = function HTMLHtmlElement() {
//   HTMLElement.call(this)
//   this.tagName = 'HTML'
// }
//
// localStorage = {
//      getItem: function(key) {
//         console.log("localStorage===>getItem ===>", key)
//     },
//     setItem: function(key, val) {
//         console.log("localStorage===>setItem ===>", key, val)
//     },
// }
//
// function Screen() {
//
// }
//
// function History() {
//
// }
// sessionStorage = {
//      getItem: function(key) {
//         console.log("sessionStorage===>getItem ===>", key)
//     },
//     setItem: function(key, val) {
//         console.log("sessionStorage===>setItem ===>", key, val)
//     },
// }
// window.now = function (val){
//     console.log('now==>',val)
// }
// window.XMLHttpRequest = function XMLHttpRequest() { }
// window.XMLHttpRequest.prototype.open = function open() { }
// window.XMLHttpRequest.prototype.send = function send() { }
// window.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader() { }
// window.XMLHttpRequest.prototype.addEventListener = function addEventListener() { }
//
// function HTMLDocument() {
//   this.cookie = 'abRequestId=79283a98-14b1-5bea-b467-052e5a089f6a; xsecappid=xhs-pc-web; a1=198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196; webId=3509aa5d43b0a164cab500aa153c1536; gid=yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf; webBuild=4.75.1; websectiga=cffd9dcea65962b05ab048ac76962acee933d26157113bb213105a116241fa6c; sec_poison_id=3c8be59f-9fd4-49d5-b2ca-c475d8727be2; unread={%22ub%22:%226875c2d8000000001c035fea%22%2C%22ue%22:%2268707087000000001c035c88%22%2C%22uc%22:9}; loadts=1754359183895'
// }
// HTMLDocument.prototype.addEventListener = function addEventListener() { }
// HTMLDocument.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
//   if (tagName === '*') {
//     return watch(other HTMLCollection())
//   }
//   console.log('HTMLDocument.prototype.getElementsByTagName的参数为===>', tagName)
// }
// HTMLDocument.prototype.documentElement = watch(other HTMLHtmlElement())
// HTMLDocument.prototype.all = watch(other HTMLAllCollection())
// HTMLDocument.prototype.body = watch(other HTMLBodyElement())
// safeFunction(HTMLDocument.prototype.addEventListener)
// safeFunction(HTMLDocument.prototype.getElementsByTagName)
// document = other HTMLDocument()
// window.Document = HTMLDocument
//
// function Navigator() {
//
// }
// Navigator.prototype.webdriver = false
// Navigator.prototype.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
// Navigator.prototype.appName = 'Netscape'
// Navigator.prototype.permissions = watch(other Permissions())
// Navigator.prototype.userAgentData = watch(other NavigatorUAData())
// navigator = other Navigator()
// window.Navigator = Navigator
//
//
// screen = other Screen()
// window.Screen = Screen
//
//
// history = other History()
// window.History = History
//
// function Location() {
//
// }
// Location.prototype.href = 'https://www.xiaohongshu.com/explore?language=zh-CN'
// location = other Location()
// window.Location = Location
//
// window = watch(window, 'window')
//
// location = watch(location, 'location')
// document = watch(document, 'document')
// screen = watch(screen, 'screen')
// navigator = watch(navigator, 'navigator')
// localStorage = watch(localStorage, 'localStorage')
// history = watch(history, 'history')
// sessionStorage = watch(sessionStorage, 'sessionStorage')