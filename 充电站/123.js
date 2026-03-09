const CryptoJS = require("crypto-js");

const key = CryptoJS.enc.Utf8.parse("ErYu78ijuVaM7Y0UqwvpO738uNC9ALF7");
const iv = CryptoJS.enc.Utf8.parse("Ol9mqvZ6ijnytr7O");
console.log(key,iv)
const encryptResult = CryptoJS.AES.encrypt('1752799057', key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
})
ciphertext = CryptoJS.enc.Base64.stringify(encryptResult.ciphertext)
console.log(ciphertext); // 应输出 "7POwawQTA3gnV2iq/c1iqg=="


 var decryptData = Object(__WEBPACK_IMPORTED_MODULE_17__crypt_aes__["dcajess"])(rdata.data);
                var realData = Object(__WEBPACK_IMPORTED_MODULE_17__crypt_aes__["dcajess"])(decryptData.Data, decryptData.UTS + "000000", decryptData.UVER);