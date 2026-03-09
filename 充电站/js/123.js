const CryptoJS = require("crypto-js");

function _cajess(endData, a, b) {
  var key = a ? CryptoJS.enc.Utf8.parse(a) : CryptoJS.enc.Utf8.parse('7fb498553e3c462988c3b9573692bd5f');
  var iv = b ? CryptoJS.enc.Utf8.parse(b) : CryptoJS.enc.Utf8.parse('98d71fe589499967');
  var encryptResult = CryptoJS.AES.encrypt(endData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encryptResult.ciphertext);
}

function dcajess(endData, a, b) {
  window._a = "6fb498553e3c462988c3b9573692bd5f";
  window._b = "98d71fe589499968";
  var key = a ? __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Utf8.parse(a) : __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Utf8.parse(window.__a);
  var iv = b ? __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Utf8.parse(b) : __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Utf8.parse(window.__b);
  var baseResult = __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Base64.parse(endData);
  var ciphertext = __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Base64.stringify(baseResult);
  var decryptResult = __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.mode.CBC,
    padding: __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.pad.Pkcs7
  });
  var resData = __WEBPACK_IMPORTED_MODULE_4_crypto_js___default.a.enc.Utf8.stringify(decryptResult);
  return JSON.parse(resData);
}

console.log(_cajess('{"DeviceType":"WEB","ReqSource":100,"RefreshToken":"A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDM0NzY4MC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.efGz7Oo7egLW4JK4LJnksnxjcPDnbslBZJn8yFAOp5A","ClientIP":"27.20.111.203"}','1752814284000000','JT5O7PfAZV9kQf17'))
