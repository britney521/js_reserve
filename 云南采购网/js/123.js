const {JSDOM} = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
window = dom.window;
document = dom.document;
navigator = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
};
const $ = require('jquery');
var p_;

function getp() {
    eval(function (p, a, c, k, e, d) {
        e = function (c) {
            return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
        };
        if (!''.replace(/^/, String)) {
            while (c--) d[e(c)] = k[c] || e(c);
            k = [function (e) {
                return d[e]
            }];
            e = function () {
                return '\\w+'
            };
            c = 1;
        }
        ;
        while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
        p_ = p;
        return p;
    }('i n$=[\'\\q\\f\\a\\4\\k\\k\\3\\o\\p\\3\',\'\\q\\m\\4\\c\\B\\4\\o\\g\\m\\3\\6\',\'\\q\\w\\a\\4\\k\\k\\3\\o\\p\\3\\G\\7\\6\\b\'];$(n$[0])["\\g\\a\\7\\m"]();$(y(){F(y(){i 9={};i 8;i 5=A;i j=I["\\v\\g\\3\\6\\E\\p\\3\\o\\e"]["\\e\\7\\H\\7\\m\\3\\6\\w\\4\\g\\3"]();5=5*C;(8=j["\\b\\4\\e\\f\\a"](/D ([\\d.]+)/))?9["\\h\\3"]=8[l]:(8=j["\\b\\4\\e\\f\\a"](/J\\/([\\d.]+)/))?9["\\c\\h\\6\\3\\c\\7\\t"]=8[l]:(8=j["\\b\\4\\e\\f\\a"](/T\\/([\\d.]+)/))?9["\\f\\a\\6\\7\\b\\3"]=8[l]:(8=j["\\b\\4\\e\\f\\a"](/S.([\\d.]+)/))?9["\\7\\x\\3\\6\\4"]=8[l]:(8=j["\\b\\4\\e\\f\\a"](/R\\/([\\d.]+).*U/))?9["\\g\\4\\c\\4\\6\\h"]=8[l]:V;5=5+Q;r(9["\\h\\3"]||9["\\c\\h\\6\\3\\c\\7\\t"]||9["\\f\\a\\6\\7\\b\\3"]||9["\\7\\x\\3\\6\\4"]||9["\\g\\4\\c\\4\\6\\h"]){5=(5*L+K);r(5<s)5=5+z;i u=$(n$[1]);r(5>z)5=P["\\c\\k\\7\\7\\6"](5/s);u["\\O\\4\\k"](5);$(n$[2])["\\g\\v\\N\\b\\h\\e"]()}},M)});', 58, 58, '|||x65|x61|x08c924|x72|x6f|x0fcad9|x06dd1a|x68|x6d|x66||x74|x63|x73|x69|var|x01c264|x6c|0x1|x77|_|x6e|x67|x23|if|0x7b|x78|x0b515d|x75|x43|x70|function|0x929|0x26|x5f|0x2e|msie|x41|setTimeout|x46|x4c|navigator|firefox|0x7|0x3|0x3e8|x62|x76|Math|0x4b|version|opera|chrome|safari|0x0'.split('|'), 0, {}))
    return p_;
}

console.log(getp())


var _$ = ['\x23\x63\x68\x61\x6c\x6c\x65\x6e\x67\x65', '\x23\x77\x61\x66\x5f\x61\x6e\x73\x77\x65\x72', '\x23\x43\x68\x61\x6c\x6c\x65\x6e\x67\x65\x46\x6f\x72\x6d'];
$(_$[0])["\x73\x68\x6f\x77"]();
$(function () {
    setTimeout(function () {
        var x06dd1a = {};
        var x0fcad9;
        var x08c924 = 0x41;
        var x01c264 = navigator["\x75\x73\x65\x72\x41\x67\x65\x6e\x74"]["\x74\x6f\x4c\x6f\x77\x65\x72\x43\x61\x73\x65"]();
        x08c924 = x08c924 * 0x3e;
        (x0fcad9 = x01c264["\x6d\x61\x74\x63\x68"](/msie ([\d.]+)/)) ? x06dd1a["\x69\x65"] = x0fcad9[0x1] : (x0fcad9 = x01c264["\x6d\x61\x74\x63\x68"](/firefox\/([\d.]+)/)) ? x06dd1a["\x66\x69\x72\x65\x66\x6f\x78"] = x0fcad9[0x1] : (x0fcad9 = x01c264["\x6d\x61\x74\x63\x68"](/chrome\/([\d.]+)/)) ? x06dd1a["\x63\x68\x72\x6f\x6d\x65"] = x0fcad9[0x1] : (x0fcad9 = x01c264["\x6d\x61\x74\x63\x68"](/opera.([\d.]+)/)) ? x06dd1a["\x6f\x70\x65\x72\x61"] = x0fcad9[0x1] : (x0fcad9 = x01c264["\x6d\x61\x74\x63\x68"](/version\/([\d.]+).*safari/)) ? x06dd1a["\x73\x61\x66\x61\x72\x69"] = x0fcad9[0x1] : 0x0;
        x08c924 = x08c924 + 0x25;
        if (x06dd1a["\x69\x65"] || x06dd1a["\x66\x69\x72\x65\x66\x6f\x78"] || x06dd1a["\x63\x68\x72\x6f\x6d\x65"] || x06dd1a["\x6f\x70\x65\x72\x61"] || x06dd1a["\x73\x61\x66\x61\x72\x69"]) {
            x08c924 = (x08c924 * 0x3 + 0x7);
            if (x08c924 < 0x7b) x08c924 = x08c924 + 0x929;
            var x0b515d = $(_$[1]);
            if (x08c924 > 0x929) x08c924 = Math["\x66\x6c\x6f\x6f\x72"](x08c924 / 0x7b);
            x0b515d["\x76\x61\x6c"](x08c924);
            $(_$[2])["\x73\x75\x62\x6d\x69\x74"]()
        }
    }, 0x3e8)
});