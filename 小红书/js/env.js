let setProxyArr = function (proxyObjArr) {
  for (let i = 0; i < proxyObjArr.length; i++) {
    const handler = `{
    get:function(target,property,receiver){
    console.log("方法:","get","对象","${proxyObjArr[i]}","属性:",
property,"属性类型:",typeof property,"属性值:",target[property],"属性值类型:",typeof target[property]);
return Reflect.get(...arguments)
debugger
    },
    set:function(target,property,value,receiver){
    console.log("方法:","set","对象:","${proxyObjArr[i]}","属性:",
property,"属性类型:",typeof property,"属性值:",value,"属性值类型:",typeof target[property]);
    return Reflect.set(...arguments);
    }
  }`;
    eval(`try{
        ${proxyObjArr[i]};
        ${proxyObjArr[i]} = new Proxy(${proxyObjArr[i]},${handler});
        } catch (e){
         ${proxyObjArr[i]} = {};
         ${proxyObjArr[i]} = new Proxy(${proxyObjArr[i]},${handler});
         }`);
  }
}
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
window = global
window.Buffer = Buffer
delete global
delete Buffer
window.Window = function () { }
Object.setPrototypeOf(window, Window.prototype)
window.addEventListener = function addEventListener() { }
window.MouseEvent = function MouseEvent() { }
window.requestAnimationFrame = function requestAnimationFrame() { }
window.requestIdleCallback = function requestIdleCallback() { }
window.DeviceMotionEvent = function DeviceMotionEvent() { }
window.DeviceOrientationEvent = function DeviceOrientationEvent() { }
window.NavigatorUAData = function NavigatorUAData() { }
window.PermissionStatus = function PermissionStatus() {
  this.state = "prompt"
}
window.XMLHttpRequest = function XMLHttpRequest() { }
window.XMLHttpRequest.prototype.open = function open() { }
window.XMLHttpRequest.prototype.send = function send() { }
window.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader() { }
window.XMLHttpRequest.prototype.addEventListener = function addEventListener() { }

window.Permissions = function Permissions() { }
window.Permissions.prototype.query = function query() {
  console.log('Permissions.prototype.query的参数为===>', arguments[0])
  return Promise.resolve(watch(new PermissionStatus()))
}

window.HTMLCollection = function HTMLCollection() {
  this._elements = [watch(new HTMLHtmlElement())];
}
window.HTMLCollection.prototype[Symbol.iterator] = function () {
  let index = 0;
  const elements = this._elements;
  return {
    next: function () {
      if (index < elements.length) {
        return { value: elements[index++], done: false };
      } else {
        return { value: undefined, done: true };
      }
    }
  };
};
window.HTMLAllCollection = function HTMLAllCollection() {
  this.length = 1048
}
window.Element = function Element() { }
window.Element.prototype.getAttribute = function getAttribute() { }
window.HTMLElement = function HTMLElement() {
  Element.call(this)
}
window.Element.prototype.removeChild = function removeChild() { }
HTMLElement.prototype = Object.create(Element.prototype)
HTMLElement.prototype.constructor = HTMLElement
window.HTMLHtmlElement = function HTMLHtmlElement() {
  HTMLElement.call(this)
  this.tagName = 'HTML'
}
HTMLHtmlElement.prototype = Object.create(HTMLElement.prototype)
HTMLHtmlElement.prototype.constructor = HTMLHtmlElement
window.HTMLBodyElement = function HTMLBodyElement() {
  HTMLElement.call(this)
  this.tagName = 'BODY'
}
HTMLBodyElement.prototype = Object.create(HTMLElement.prototype)
HTMLBodyElement.prototype.constructor = HTMLBodyElement
window.top = window.window = window.self = window
window.chrome = watch({})
window.loadts = Date.now().toString()
window.xsecappid = 'xhs-pc-web'
safeFunction(window.addEventListener)
safeFunction(window.MouseEvent)
safeFunction(window.Element)
safeFunction(window.Element.prototype.getAttribute)
safeFunction(window.HTMLElement)
safeFunction(window.HTMLHtmlElement)
safeFunction(window.HTMLCollection)
safeFunction(window.HTMLAllCollection)
safeFunction(window.HTMLBodyElement)
safeFunction(window.HTMLHtmlElement.prototype.removeChild)
safeFunction(window.Permissions)
safeFunction(window.Permissions.prototype.query)
safeFunction(window.PermissionStatus)
safeFunction(window.DeviceMotionEvent)
safeFunction(window.DeviceOrientationEvent)
safeFunction(window.NavigatorUAData)
safeFunction(window.requestAnimationFrame)
safeFunction(window.requestIdleCallback)
safeFunction(window.XMLHttpRequest)
safeFunction(window.XMLHttpRequest.prototype.open)
safeFunction(window.XMLHttpRequest.prototype.send)
safeFunction(window.XMLHttpRequest.prototype.setRequestHeader)
safeFunction(window.XMLHttpRequest.prototype.addEventListener)


function HTMLDocument() {
  this.cookie = 'abRequestId=79283a98-14b1-5bea-b467-052e5a089f6a; xsecappid=xhs-pc-web; a1=198554a01cf7enzt7hym0o6ertr683h1g0fewk7g230000193196; webId=3509aa5d43b0a164cab500aa153c1536; gid=yjY22408S2kjyjY22408y8TWSiWdIu9Wxv68ikJlKdF9Fdq8KYqxyE888yjqyjK80qfJK8qf; webBuild=4.75.1; websectiga=cffd9dcea65962b05ab048ac76962acee933d26157113bb213105a116241fa6c; sec_poison_id=3c8be59f-9fd4-49d5-b2ca-c475d8727be2; unread={%22ub%22:%226875c2d8000000001c035fea%22%2C%22ue%22:%2268707087000000001c035c88%22%2C%22uc%22:9}; loadts=1754359183895'
}
HTMLDocument.prototype.addEventListener = function addEventListener() { }
HTMLDocument.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
  if (tagName === '*') {
    return watch(new HTMLCollection())
  }
  console.log('HTMLDocument.prototype.getElementsByTagName的参数为===>', tagName)
}
HTMLDocument.prototype.documentElement = watch(new HTMLHtmlElement())
HTMLDocument.prototype.all = watch(new HTMLAllCollection())
HTMLDocument.prototype.body = watch(new HTMLBodyElement())
safeFunction(HTMLDocument.prototype.addEventListener)
safeFunction(HTMLDocument.prototype.getElementsByTagName)
document = new HTMLDocument()
window.Document = HTMLDocument

function Navigator() {

}
Navigator.prototype.webdriver = false
Navigator.prototype.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
Navigator.prototype.appName = 'Netscape'
Navigator.prototype.permissions = watch(new Permissions())
Navigator.prototype.userAgentData = watch(new NavigatorUAData())
navigator = new Navigator()
window.Navigator = Navigator

function Screen() {

}
screen = new Screen()
window.Screen = Screen

function History() {

}
history = new History()
window.History = History

function Location() {

}
Location.prototype.href = 'https://www.xiaohongshu.com/explore?language=zh-CN'
location = new Location()
window.Location = Location
// setProxyArr(['window', 'document', 'location', 'history', 'screen', 'navigator'])
