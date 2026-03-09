var CryptoJS = require('Crypto-JS');
// var secretKey = 'Ydj265HCRDOXQZwr'

// var checkPosArr = [
//     {
//         "x": 117,
//         "y": 31
//     },
//     {
//         "x": 183,
//         "y": 90
//     },
//     {
//         "x": 252,
//         "y": 92
//     }
// ]

function aesEncrypt(word, keyWord) {
    // var keyWord = keyWord || "XwKsGlMcdPMEhR1B"
    var key = CryptoJS.enc.Utf8.parse(keyWord);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

function get_captcha(backToken, checkPosArr, secretKey) {
    var captchaVerification = secretKey ? aesEncrypt(backToken + '---' + JSON.stringify(checkPosArr), secretKey) : backToken + '---' + JSON.stringify(checkPosArr)
    console.log(captchaVerification)
    return captchaVerification
}

function get_pointJson(checkPosArr, secretKey) {
    var pointJson = secretKey ? aesEncrypt(JSON.stringify(checkPosArr), secretKey) : JSON.stringify(checkPosArr)
    console.log(pointJson)
    return pointJson

}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var slider = 'slider' + '-' + s.join("");
    var point = 'point' + '-' + s.join("");
    // 判断下是否存在 slider
    console.log(slider,point)
    return point

}


