function gr() {
    function t() {
        if (function (t, r) {
            if (!(t instanceof r))
                throw new TypeError("Cannot call a class as a function")
        }(this, t),
            !(this instanceof t))
            return new t;
        this.reg = new Array(8),
            this.chunk = [],
            this.size = 0,
            this.reset()
    }
    return function (t, r, e) {
        r && ur(t.prototype, r),
            e && ur(t, e),
            Object.defineProperty(t, "prototype", {
                writable: !1
            })
    }(t, [{
        key: "reset",
        value: function () {
            this.reg[0] = 1937774191,
                this.reg[1] = 1226093241,
                this.reg[2] = 388252375,
                this.reg[3] = 3666478592,
                this.reg[4] = 2842636476,
                this.reg[5] = 372324522,
                this.reg[6] = 3817729613,
                this.reg[7] = 2969243214,
                this.chunk = [],
                this.size = 0
        }
    }, {
        key: "write",
        value: function (t) {
            var r = "string" == typeof t ? function (t) {
                var r = encodeURIComponent(t).replace(/%([0-9A-F]{2})/g, (function (t, r) {
                    return String.fromCharCode("0x" + r)
                }
                ))
                    , e = new Array(r.length);
                return Array.prototype.forEach.call(r, (function (t, r) {
                    e[r] = t.charCodeAt(0)
                }
                )),
                    e
            }(t) : t;
            this.size += r.length;
            var e = 64 - this.chunk.length;
            if (r.length < e)
                this.chunk = this.chunk.concat(r);
            else
                for (this.chunk = this.chunk.concat(r.slice(0, e)); this.chunk.length >= 64;)
                    this._compress(this.chunk),
                        e < r.length ? this.chunk = r.slice(e, Math.min(e + 64, r.length)) : this.chunk = [],
                        e += 64
        }
    }, {
        key: "sum",
        value: function (t, r) {
            t && (this.reset(),
                this.write(t)),
                this._fill();
            for (var e = 0; e < this.chunk.length; e += 64)
                this._compress(this.chunk.slice(e, e + 64));
            var n, o, i, u = null;
            if ("hex" == r) {
                u = "";
                for (e = 0; e < 8; e++)
                    u += (n = this.reg[e].toString(16),
                        o = 8,
                        i = "0",
                        n.length >= o ? n : i.repeat(o - n.length) + n)
            } else
                for (u = new Array(32),
                    e = 0; e < 8; e++) {
                    var s = this.reg[e];
                    u[4 * e + 3] = (255 & s) >>> 0,
                        s >>>= 8,
                        u[4 * e + 2] = (255 & s) >>> 0,
                        s >>>= 8,
                        u[4 * e + 1] = (255 & s) >>> 0,
                        s >>>= 8,
                        u[4 * e] = (255 & s) >>> 0
                }
            return this.reset(),
                u
        }
    }, {
        key: "_compress",
        value: function (t) {
            if (t < 64)
                console.error("compress error: not enough data");
            else {
                for (var r = function (t) {
                    for (var r = new Array(132), e = 0; e < 16; e++)
                        r[e] = t[4 * e] << 24,
                            r[e] |= t[4 * e + 1] << 16,
                            r[e] |= t[4 * e + 2] << 8,
                            r[e] |= t[4 * e + 3],
                            r[e] >>>= 0;
                    for (var n = 16; n < 68; n++) {
                        var o = r[n - 16] ^ r[n - 9] ^ dr(r[n - 3], 15);
                        o = o ^ dr(o, 15) ^ dr(o, 23),
                            r[n] = (o ^ dr(r[n - 13], 7) ^ r[n - 6]) >>> 0
                    }
                    for (n = 0; n < 64; n++)
                        r[n + 68] = (r[n] ^ r[n + 4]) >>> 0;
                    return r
                }(t), e = this.reg.slice(0), n = 0; n < 64; n++) {
                    var o = dr(e[0], 12) + e[4] + dr(yr(n), n)
                        , i = ((o = dr(o = (4294967295 & o) >>> 0, 7)) ^ dr(e[0], 12)) >>> 0
                        , u = br(n, e[0], e[1], e[2]);
                    u = (4294967295 & (u = u + e[3] + i + r[n + 68])) >>> 0;
                    var s = mr(n, e[4], e[5], e[6]);
                    s = (4294967295 & (s = s + e[7] + o + r[n])) >>> 0,
                        e[3] = e[2],
                        e[2] = dr(e[1], 9),
                        e[1] = e[0],
                        e[0] = u,
                        e[7] = e[6],
                        e[6] = dr(e[5], 19),
                        e[5] = e[4],
                        e[4] = (s ^ dr(s, 9) ^ dr(s, 17)) >>> 0
                }
                for (var c = 0; c < 8; c++)
                    this.reg[c] = (this.reg[c] ^ e[c]) >>> 0
            }
        }
    }, {
        key: "_fill",
        value: function () {
            var t = 8 * this.size
                , r = this.chunk.push(128) % 64;
            for (64 - r < 8 && (r -= 64); r < 56; r++)
                this.chunk.push(0);
            for (var e = 0; e < 4; e++) {
                var n = Math.floor(t / 4294967296);
                this.chunk.push(n >>> 8 * (3 - e) & 255)
            }
            for (e = 0; e < 4; e++)
                this.chunk.push(t >>> 8 * (3 - e) & 255)
        }
    }]),
        t
}

function ur(t, r) {
    for (var e = 0; e < r.length; e++) {
        var n = r[e];
        n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value" in n && (n.writable = !0),
            Object.defineProperty(t, sr(n.key), n)
    }
}

function sr(t) {
    var r = function (t, r) {
        if ("object" != ir(t) || !t)
            return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var n = e.call(t, r || "default");
            if ("object" != ir(n))
                return n;
            throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return ("string" === r ? String : Number)(t)
    }(t, "string");
    return "symbol" == ir(r) ? r : r + ""
}

function ir(t) {
    return ir = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    }
        : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        ,
        ir(t)
}

function dr(t, r) {
    return (t << (r %= 32) | t >>> 32 - r) >>> 0
}
function yr(t) {
    return 0 <= t && t < 16 ? 2043430169 : 16 <= t && t < 64 ? 2055708042 : void console.error("invalid j for constant Tj")
}
function br(t, r, e, n) {
    return 0 <= t && t < 16 ? (r ^ e ^ n) >>> 0 : 16 <= t && t < 64 ? (r & e | r & n | e & n) >>> 0 : (console.error("invalid j for bool function FF"),
        0)
}

function mr(t, r, e, n) {
    return 0 <= t && t < 16 ? (r ^ e ^ n) >>> 0 : 16 <= t && t < 64 ? (r & e | ~r & n) >>> 0 : (console.error("invalid j for bool function GG"),
        0)
}
function wr(t) {
    return wr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    }
        : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        ,
        wr(t)
}
function xr(t, r) {
    var e = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(t);
        r && (n = n.filter((function (r) {
            return Object.getOwnPropertyDescriptor(t, r).enumerable
        }
        ))),
            e.push.apply(e, n)
    }
    return e
}
function Sr(t) {
    for (var r = 1; r < arguments.length; r++) {
        var e = null != arguments[r] ? arguments[r] : {};
        r % 2 ? xr(Object(e), !0).forEach((function (r) {
            Pr(t, r, e[r])
        }
        )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)) : xr(Object(e)).forEach((function (r) {
            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r))
        }
        ))
    }
    return t
}
function Pr(t, r, e) {
    return (r = function (t) {
        var r = function (t, r) {
            if ("object" != wr(t) || !t)
                return t;
            var e = t[Symbol.toPrimitive];
            if (void 0 !== e) {
                var n = e.call(t, r || "default");
                if ("object" != wr(n))
                    return n;
                throw new TypeError("@@toPrimitive must return a primitive value.")
            }
            return ("string" === r ? String : Number)(t)
        }(t, "string");
        return "symbol" == wr(r) ? r : r + ""
    }(r)) in t ? Object.defineProperty(t, r, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[r] = e,
        t
}
function jr(t) {
    !function (t, r) {
        var e = "https://mon.zijieapi.com";
        if (vr.slU && (e = vr.slU),
            Math.random() <= t) {
            var n = "".concat(e, "/monitor_browser/collect/batch/?biz_id=", "web_bdms_cn")
                , o = {
                    ev_type: "batch",
                    list: r.map((function (t) {
                        return Sr(Sr({}, t), {}, {
                            common: {
                                context: {
                                    ctx_bdms_aid: vr.aid + "",
                                    ctx_bdms_page_id: vr.pageId + ""
                                },
                                bid: "web_bdms_cn",
                                pid: window.location.pathname,
                                view_id: "/_2",
                                user_id: "0-u-s-1-d",
                                session_id: "0-a-1-2-d",
                                device_id: "0-d-v-1-d",
                                release: "b-1.0.1.19-fix.01",
                                env: "production",
                                url: window.location.href,
                                timestamp: +new Date,
                                sdk_version: "1.6.1",
                                sdk_name: "SDK_SLARDAR_WEB"
                            }
                        })
                    }
                    ))
                };
            try {
                var i = new XMLHttpRequest;
                i.open("POST", n, !0),
                    i.setRequestHeader("Content-type", "application/json"),
                    i.send(JSON.stringify(o))
            } catch (t) { }
        }
    }(.001, [{
        ev_type: "performance",
        payload: {
            name: "s_time",
            type: "perf",
            value: Math.round(100 * t) / 100,
            extra: {}
        }
    }])
}
t = gr()

fun = new t()
params = "device_platform=webapp&aid=6383&channel=channel_pc_web&item_id=7549224644969057536&comment_id=7549639717437784891&cut_version=1&cursor=0&count=3&item_type=0&update_version_code=170400&pc_client_type=1&pc_libra_divert=Mac&support_h265=1&support_dash=1&cpu_core_num=12&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=MacIntel&browser_name=Chrome&browser_version=128.0.0.0&browser_online=true&engine_name=Blink&engine_version=128.0.0.0&os_name=Mac+OS&os_version=10.15.7&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=100&webid=7532353517529351689&uifid=9e5c45806baed1121aef2e4ebdb50ae0783a7b9267143d29acaade7dde1bacd53a317bdec882a9b924ad9b45815c2e3cbf8632e6ca9c91748f759d2479f1daffb24648da6918a63b3b6de4a84f34cb95a7b12efdf7e9ff699d154e6194f94a8582003e33ec64b21d535b5743df20e85a5a45c6724a7e2d8b926ccb2efc11c79fff8241fb6d73fec9389cd38bad4d8b126fb62373745c4882443c2157ad93e1ebeeacca8ae3383587181041469f9026a0564b98cab8c3955433342174ff4e95a0&verifyFp=verify_mghdan0n_H6KexA6b_SMww_4MQF_8TcI_3a1HsVuGgTAN&fp=verify_mghdan0n_H6KexA6b_SMww_4MQF_8TcI_3a1HsVuGgTAN&msToken=HqEPsaPz5q_Gw8PkEdwpoqG8FxG1q_VCwB9Lcc5dBaKvLnkDQz51kZlSnQnTJhJjwNMbxsRIs2_AlSely9d9gf8PFar7SmWfoK0OsxFmxwDrlt0W5BLwFFdVpGyTaHz8jsKOkb5p7tWQ6EPSNRR0Boom-1BDHLU7YVP0ubDGpe2WUQ%3D%3Ddhzx"


console.log(fun.sum(fun.sum(params)))
console.log(fun.sum(fun.sum('dhzx')))
// console.log(fun.sum('dhzx'))