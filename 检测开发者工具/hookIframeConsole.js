// ==UserScript==
// @name        Hook iframe console
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description try to take over the world!
// @author      You
// @include     *
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
    'use strict';
    if (window.__CONSOLE_HIJACKED__) return;
    window.__CONSOLE_HIJACKED__ = true;

    // 保存原生方法（使用Symbol防止检测）
    const native = {
        FunctionToString: Function.prototype.toString,
        console: window.console,
        appendChild: Element.prototype.appendChild,
        insertBefore: Element.prototype.insertBefore,
        append: Element.prototype.append,
        prepend: Element.prototype.prepend,
        bind: Function.prototype.bind
    };

    // 存储原始函数的WeakMap
    const originalFunctionMap = new WeakMap();

    // 安全包装函数 (修复核心问题)
    function createSafeWrapper(original, method) {
        // 检查是否已经是包装函数
        if (originalFunctionMap.has(original)) {
            return original;
        }

        // 创建无原型链污染的包装函数
        const wrapper = function() {
            if(arguments[0] && arguments[0] instanceof Error){
                return original.apply(this, []);
            }
            return original.apply(this, arguments);
        };

        // 存储原始引用
        originalFunctionMap.set(wrapper, original);

        // 精确伪装函数属性
        Object.defineProperties(wrapper, {
            name: {
                value: original.name || method,
                configurable: true
            },
            length: {
                value: original.length,
                configurable: true
            },
            toString: {
                value: function() {
                    const realFunc = originalFunctionMap.get(this) || this;
                    return native.FunctionToString.call(realFunc);
                },
                configurable: true
            }
        });

        return wrapper;
    }

    // 劫持控制台 (带安全检测)
    function hijackConsole(consoleObj) {
        const methods = ['log', 'warn', 'error', 'info', 'debug'];

        methods.forEach(method => {
            try {
                const descriptor = Object.getOwnPropertyDescriptor(consoleObj, method);

                // 跳过不可配置的方法
                if (descriptor && !descriptor.configurable) return;

                const original = consoleObj[method];

                // 只劫持函数类型
                if (typeof original !== 'function') return;

                consoleObj[method] = createSafeWrapper(original, method);
            } catch (e) {
                // 静默处理错误
            }
        });
    }

    // 修复DOM方法劫持
    function hijackDomMethods() {
        const methods = ['appendChild', 'insertBefore', 'append', 'prepend'];

        methods.forEach(method => {
            const nativeFn = Element.prototype[method];

            Element.prototype[method] = function() {
                const node = arguments[0];
                const result = nativeFn.apply(this, arguments);

                if (node?.tagName === 'IFRAME') {
                    try {
                        hijackConsole(node.contentWindow?.console);
                    } catch (e) {
                        // 跨域忽略
                    }
                }

                return result;
            };

            // 伪装原生方法属性
            Object.defineProperties(Element.prototype[method], {
                name: { value: nativeFn.name },
                length: { value: nativeFn.length },
                toString: {
                    value: () => native.FunctionToString.call(nativeFn)
                }
            });
        });
    }

    // 初始化
    hijackConsole(window.console);
    hijackDomMethods();

    // 劫持已存在的iframe
    document.querySelectorAll('iframe').forEach(iframe => {
        hijackConsole(iframe.contentWindow?.console);
    });
})();

