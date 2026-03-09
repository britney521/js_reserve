const CryptoJS = require("crypto-js");

function aesCbcEncrypt(plaintext,num) {
    // 定义 Key 和 IV（UTF-8 编码）
    const key = CryptoJS.enc.Utf8.parse(num);
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000');

    // AES-CBC 加密
    const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(plaintext), // 明文转 WordArray
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,       // CBC 模式
            padding: CryptoJS.pad.Pkcs7    // PKCS#7 填充
        }
    );
    // 返回 16 进制字符串
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

// 测试
const plaintext = "Hello, AES-CBC!";
const ciphertext = aesCbcEncrypt(plaintext);
console.log("加密结果（Hex）:", ciphertext);

var uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

console.log(uuid())


function exx() {
    return (65536 * (1 + Math['random'
        ]()) | 0)['toString'
        ](16)['substring'
        ](1)
}

function get_h() {return exx() + exx() + exx() + exx()}

console.log(get_h());


var crypto=require('crypto')

function  hash(text,ha){
    var hs;
    if (ha=="sha256"){
        hs=crypto.createHash('sha256').update(text).digest('hex');
    }  if (ha=="md5"){
        hs=crypto.createHash('md5').update(text).digest('hex');
    }if(ha=="sha1"){hs=crypto.createHash('sha1').update(text).digest('hex');}
    return hs;
}