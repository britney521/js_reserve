const CryptoJS = require("crypto-js");

var appSecret = 'nmpasecret2020';  //

function jsonMD5ToStr(_0x20954c) {
    var _0x4699d8 = {
        'rlhqt': '%21',
        'AphAs': '%28',
        'MDmYq': function (_0x291a56, _0x5dbbe1) {
            return _0x291a56(_0x5dbbe1);
        },
        'YvYLd': function (_0x40b163, _0x2aa002) {
            return _0x40b163 + _0x2aa002;
        },
        'WCdKH': '%7E'
    };
    var _0x4da70e = [
        "5",
        "3",
        "1",
        "2",
        "0",
        "6",
        "4"
    ]
        , _0x253110 = 0x0;
    while (!![]) {
        switch (_0x4da70e[_0x253110++]) {
            case '0':
                _0x20954c = _0x20954c['replace'](new RegExp('\x5c)', 'gm'), '%29');
                continue;
            case '1':
                _0x20954c = _0x20954c['replace'](new RegExp('!', 'gm'), _0x4699d8['rlhqt']);
                continue;
            case '2':
                _0x20954c = _0x20954c['replace'](new RegExp('\x5c(', 'gm'), '%28');
                continue;
            case '3':
                _0x20954c = _0x4699d8['MDmYq'](encodeURIComponent, _0x20954c);
                continue;
            case '4':
                return CryptoJS.MD5(_0x20954c).toString();
            case '5':
                _0x20954c = _0x20954c['concat'](_0x4699d8['YvYLd']('&', appSecret));
                continue;
            case '6':
                _0x20954c = _0x20954c['replace'](new RegExp('~', 'gm'), _0x4699d8['WCdKH']);
                continue;
        }
        break;
    }
}

function get_sign(str) {
    return jsonMD5ToStr(str)
}

console.log(jsonMD5ToStr('isSenior=N&itemIds=ff8080818046502f0180f934f6873f78&searchValue=唇膏&timestamp=1749118278000'))