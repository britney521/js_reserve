let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/9-9.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

RegExp.prototype.test = function(){return true}
window = global;
var $a = ["wpwEWA==", "woPCpMOY", "w6YwGw==", "wrlDw54=", "wpMKw6w=", "woJiPw==", "wosEZQ==", "wprDgcKY", "ZsKwwrU=", "G8K1wq8=", "ZMK5JQ==", "X8KgEw==", "DAjDsA==", "wrjDp8KX", "w6hMwow=", "w73DkSc=", "wrNRwpQ=", "wp/Dl8Kr", "woLDnMOg", "w7XCrh0=", "wpDCkyg=", "woxeNw==", "w6XDjCE=", "Pgcb", "CzsP", "w7M0fQ==", "wrJyw5g=", "wqbCpMKi", "w7PCr8OI", "aMKrwrA=", "w57DnzE=", "UwPCjg==", "ZSBl", "wpvDmjM=", "wpEswq4=", "woowDA==", "wofCqsOG", "woIhZw==", "wr7Cg8O/", "w57DhX8=", "wolqw7g=", "wqRNPQ==", "E1TDoA==", "DMK7woo=", "wpnDkcON", "HcKOPQ==", "wrPDugo=", "OCAQ", "SSfDlw==", "wpt1w6Q=", "PwQP", "wofDhMOx", "CA3ChQ==", "w7dvwqs=", "F8KsOg==", "Jl5E", "wr3CuMO7", "NEBr", "MygP", "wrvDvcOo", "GQ02", "KSbDng==", "w4QbWw==", "Lx7Cug==", "w7YwGQ==", "wqbDn8OZ", "w4HDi3M=", "dMO8w6o=", "OQY2", "wpoOXw==", "X8K/Tg==", "w6TCr8Ko", "w7UybA==", "woXCucOa", "wobDp8OL", "wqrCqi4=", "wpvCiMOS", "woXDi8Og", "w7/CssKO", "TMKPUQ==", "EALDog==", "UhNG", "wokawpk=", "w5rCvAE=", "wpbDk8Om", "a8K5LQ==", "wp/Dgjo=", "LHpO", "w7XDuMK2", "wpd3Gw==", "w6bDqA4=", "w4kYwpw=", "LHAf", "w6h8Og==", "EMKWwqs=", "wqLCv8Oa", "wrMnwp8=", "eDvDlw==", "FMOpLA==", "wqJAHw==", "w7wxEA==", "BTbDvg==", "NTkX", "QsO2w6I=", "w6U2Gw==", "csOfwq8=", "CsO1OQ==", "wojCrRk=", "OnLDjA==", "L8OpcA==", "w6ILDw==", "XsKYw68=", "w79vDg==", "bit/", "woPCu8OY", "wq8gag==", "wqDCtRA=", "woNkBA==", "CDnCpg==", "w69/Hg==", "wp9JEQ==", "w5LCnhg=", "NMKgLg==", "CAcO", "WMKJwqc=", "HzHCjw==", "w6krTg==", "BkxE", "d8K/HQ==", "P8KjwoA=", "w45YwqQ=", "wrbDnTA=", "w4zDt3o=", "wpdSGw==", "w6AtGQ==", "OsKqDg==", "w7tAw7k=", "w5fDp8Ks", "R8KEwqc=", "w7rCiQk=", "wogvUw==", "CDbCsA==", "FzQ2", "DcOzOQ==", "RcK9XQ==", "wprCt8Oc", "wpHDkcOr", "E0fDpA==", "wqtJw5M=", "IEBA", "ccO2wqQ=", "wojDvcKi", "KHFP", "wqcmbQ==", "EQjCtA==", "FEFT", "BAjClg==", "D8KrOA==", "wp9pFg==", "H8KPJA==", "wowHwpY=", "OsKww6I=", "woIZXw==", "OxjDnQ==", "IEZB", "AiPCvw==", "BH0S", "f8KPwow=", "w53CvAM=", "wqIIwpA=", "DSpH", "w7QvBw==", "w6DDncKT", "w5AdPQ==", "wqHDjsOr", "NCwB", "BjjCuQ==", "wpsywoc=", "L8K3Ow==", "wplHw7c=", "w6dtw50=", "Gg7Cjg==", "LsKgLw==", "woUQwpQ=", "wpnDkTE=", "wppQw78=", "w4/CkcKL", "FndI", "OEzDjQ==", "w7rChRo=", "VivDrw==", "wpjCusOx", "aT0j", "HTcN", "w63DhiQ=", "wocERg==", "aWHClg==", "G8O/Iw==", "csKxLg==", "woXCqMOA", "w7fCuQQ=", "woTDl8Oi", "wrbCig0=", "Nz06", "aMKYcA==", "FMK+wq4=", "GTDCrg==", "F8KYwog=", "w5NEwpU=", "w4xMGg==", "wprDl8OX", "w63Dm8KM", "w4nDsnk=", "wpMWJQ==", "I1zCjw==", "wovDhT0=", "w5HClDU=", "wovCtsKa", "YsKmPg==", "wqbDsnA=", "woMDWw==", "LjU0", "wq9nAA==", "wp7Dq8OA", "w4EpwqY=", "GT8e", "L8OSPg==", "w4PDsGk=", "wp0rQw==", "wp/Csig=", "w6YrBQ==", "woUrXg==", "wp7Dmz0=", "wpYGWg==", "Fk5g", "d8O3w6o=", "w4vDr0k=", "w43CsiQ=", "CArCjA==", "wqwxwrc=", "X8KwwrA=", "w5nDqWU=", "LcKSBA==", "w6HCnhg=", "BHkp", "wpfCg8Ol", "ED3Dng==", "WwDCiQ==", "wpnDmcKQ", "woUYaQ==", "wpXCuMOF", "PSHCjg==", "BVVy", "JFt3", "w4TDpQc=", "Ah3CuA==", "QsOaw7M=", "esOncw==", "enpS", "wonDkTM=", "QMOWw6k=", "PkB7", "RXjDtQ==", "BcKAGQ==", "KDQG", "QMKpWA==", "wq4xXg==", "H8K9wqc=", "wpXDjcOh", "w77Cm8KR", "wq5Fw58=", "w5MxbQ==", "EcKdNA==", "wpzCpMOT", "VcO4w5E=", "UMOjwqI=", "wrfCujc=", "wpPDqAI=", "wpnCpMOa", "wo5fHA==", "ARgF", "wqAyXA==", "w6PDmEw=", "RQrCqg==", "w6tgwog=", "ZCVu", "K8OBCw==", "w63DqsKG", "PyMA", "wo8Zwo4=", "w4Q/fQ==", "wrTCswk=", "wqR5w6c=", "cj3CiA==", "w53DtX4=", "wq0Lwro=", "wp7CnsOX", "wrsHwqI=", "wqxJw4U=", "KSUA", "wrpNw4Q=", "w6nCvsKU", "ZMK8IA==", "Ax7Cng==", "woPDq8Kf", "w4xCHw==", "w59+w7Q=", "wqpgw54=", "w4PDs2c=", "wpjCjQc=", "wpwdVA==", "wpEbVw==", "BsKQQg==", "JkRp", "EGNM", "B2lt", "McKLCw==", "w6HDpMK3", "RsOLw7U=", "KgPDoA==", "woRNBw==", "wrHDu8K3", "wp/CrTQ=", "LjQB", "wqFew50=", "LsKsJA==", "w6dpw6o=", "egTCsg==", "wpxbAA==", "LXPDjA==", "MTgX", "AldU", "wonDjiA=", "wptuw7o=", "UMKAw6g=", "wp3DiMOu", "FcK9Eg==", "w4Q2VQ==", "wolUJw==", "wpLCg8OL", "w7XCrMOv", "wrfCujQ=", "WsKMUQ==", "EsKrPQ==", "w6tDwpA=", "R8KEwq0=", "LMKcKg==", "NWzDqQ==", "woI+wpE=", "wqxnw5o=", "Mi3Dhg==", "NSEB", "DnV2", "w6E6BA==", "wqTDhMOw", "woQ1wqc=", "ATLCtQ==", "wo1Kw6w=", "wp9oHg==", "w47DmgQ=", "Mldt", "wrPDk8KV", "XinCrQ==", "YhvCkA==", "w6EtFg==", "NcKqWQ==", "w4DDjGE=", "dCpf", "woLDsxw=", "C8OSw6Q=", "w4l5Tw==", "wohIEQ==", "w7EYeQ==", "EhEk", "M1Fb", "CCIc", "C8O/IQ==", "Nx3Cmg==", "wot1w70=", "wooqwrE=", "MTkT", "NVvDoA==", "woxPw6o=", "w4nDsFc=", "w73Ckwo=", "woYmwqA=", "fCtb", "Llp/", "L8KmKA==", "wqF5Cw==", "YSd4", "w7PDr8Kw", "wqgkRQ==", "w73DgiQ=", "w53Cty4=", "wqsdew==", "w5DCsMOJ", "wpJmGA==", "ccOcw4U=", "w4YSGw==", "wpNXFA==", "w5HDrSs=", "wokbew==", "ZRhx", "acKiLw==", "wp49wr4=", "LcKkLg==", "IcKNZA==", "wpTCnsOX", "eMOsdA==", "LVB7", "wocJZw==", "HAjCkg==", "w5bCh8Km", "KcKeMw==", "FHhy", "w6/CssKM", "wpvCrcOT", "w745NQ==", "w79pw5E=", "DMOxLw==", "EcK1wqw=", "wpxow6E=", "w7XDo8Ko", "Aiwh", "FjvDuQ==", "PsK3OA==", "FD87", "wpVhNg==", "wpxCw6A=", "wpMzwrk=", "PTYX"];

var $b = function (a, b) {
  a = a - 0;
  var c = $a[a];
  if ($b.fxEAZh === undefined) {
    (function () {
      var f = function () {
        var i;
        try {
          i = Function("return (function() {}.constructor(\"return this\")( ));")();
        } catch (j) {
          console.log(j);
          i = window;
        }
        return i;
      };
      var g = f();
      var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      g.atob || (g.atob = function (i) {
        var j = String(i).replace(/=+$/, "");
        var k = "";
        for (var l = 0, m, n, o = 0; n = j.charAt(o++); ~n && (l % 4 ? m = m * 64 + n : m = n, l++ % 4) ? k += String.fromCharCode(255 & m >> (-2 * l & 6)) : 0) {
          n = h.indexOf(n);
        }
        return k;
      });
    })();
    var e = function (f, g) {
      var h = [];
      var l = 0;
      var m;
      var n = "";
      var o = "";
      f = atob(f);
      for (var q = 0, r = f.length; q < r; q++) {
        o += "%" + ("00" + f.charCodeAt(q).toString(16)).slice(-2);
      }
      f = decodeURIComponent(o);
      var p;
      for (p = 0; p < 256; p++) {
        h[p] = p;
      }
      for (p = 0; p < 256; p++) {
        l = (l + h[p] + g.charCodeAt(p % g.length)) % 256;
        m = h[p];
        h[p] = h[l];
        h[l] = m;
      }
      p = 0;
      l = 0;
      for (var t = 0; t < f.length; t++) {
        p = (p + 1) % 256;
        l = (l + h[p]) % 256;
        m = h[p];
        h[p] = h[l];
        h[l] = m;
        n += String.fromCharCode(f.charCodeAt(t) ^ h[(h[p] + h[l]) % 256]);
      }
      return n;
    };
    $b.mVUHLK = e;
    $b.wubNMS = {};
    $b.fxEAZh = !![];
  }
  var d = $b.wubNMS[a];
  if (d === undefined) {
    if ($b.TDhtQv === undefined) {
      var f = function (g) {
        this.wosISu = g;
        this.mIJKuZ = [1, 0, 0];
        this.xRbpTd = function () {
          return "newState";
        };
        this.gaNytX = "\\w+ *\\(\\) *{\\w+ *";
        this.HwLpql = "['|\"].+['|\"];? *}";
      };
      f.prototype.CCwTZs = function () {
        var g = new RegExp(this.gaNytX + this.HwLpql);
        var h;
        if (g.test(this.xRbpTd.toString())) {
          h = --this.mIJKuZ[1];
        } else {
          h = --this.mIJKuZ[0];
        }
        return this.gcEygn(h);
      };
      f.prototype.gcEygn = function (g) {
        if (!Boolean(~g)) {
          return g;
        }
        return this.OHhQOo(this.wosISu);
      };
      f.prototype.OHhQOo = function (g) {
        for (var h = 0, j = this.mIJKuZ.length; h < j; h++) {
          this.mIJKuZ.push(Math.round(Math.random()));
          j = this.mIJKuZ.length;
        }
        return g(this.mIJKuZ[0]);
      };
      new f($b).CCwTZs();
      $b.TDhtQv = !![];
    }
    c = $b.mVUHLK(c, b);
    $b.wubNMS[a] = c;
  } else {
    c = d;
  }
  return c;
};

console.log($b('0x19', 'Dr1n'))
// 遍历 AST 并替换 $b 调用

// 遍历 AST 并替换 $b 调用
traverse(ast, {
  CallExpression(path) {
    const callee = path.node.callee;
    if (types.isIdentifier(callee) && callee.name === '$b') {
      const args = path.node.arguments;
      if (args.length === 2 && types.isStringLiteral(args[0]) && types.isStringLiteral(args[1])) {
        const result = $b(args[0].value, args[1].value);
        path.replaceWith(types.stringLiteral(result));
      }
    }
  }
});

// 遍历 AST 并还原字符串编码，但排除 other RegExp() 中的字符串
traverse(ast, {
  StringLiteral(path) {
    // 检查当前字符串是否是 other RegExp 的参数
    const isRegExpArg = path.findParent((parentPath) => {
      return (
        types.isNewExpression(parentPath) &&
        types.isIdentifier(parentPath.node.callee, { name: 'RegExp' }) &&
        parentPath.node.arguments.includes(path.node)
      );
    });

    // 如果不是 other RegExp 的参数，则还原字符串编码
    if (!isRegExpArg) {
      if (path.node.extra) {
        path.node.extra.raw = "'" + path.node.value + "'";
      }
    }
  }
});


// 遍历 AST 并替换 $b 调用



let output = generate(ast).code
// console.log(output)
fs.writeFileSync("output/output9-9.js", output)