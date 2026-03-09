const CryptoJS = require("crypto-js");
window = global;

function randomNum(n) {
  var rnd = "";
  for (var i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  return rnd;
}
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

// param = '{"DeviceType":"WEB","ReqSource":100,"RefreshToken":"A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDM0NzY4MC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.efGz7Oo7egLW4JK4LJnksnxjcPDnbslBZJn8yFAOp5A","ClientIP":"27.20.111.203"}'

function get_params(param){
    uts = Math.round(new Date().getTime() / 1000) + "";
          uver = _cajess(uts).substring(0, 16);
          paramAfterEdit = _cajess(param, uts + "000000", uver);
            JSON.stringify({
            Data: paramAfterEdit,
            UTS: uts,
            UVER: uver,
            UUID: new Date().getTime() + "" + randomNum(10)
          });

    return JSON.stringify({
            Data: paramAfterEdit,
            UTS: uts,
            UVER: uver,
            UUID: new Date().getTime() + "" + randomNum(10)
          });
}


// 解密token

function dcajess(endData, a, b) {
    var key = a ? CryptoJS.enc.Utf8.parse(a) : CryptoJS.enc.Utf8.parse('7fb498553e3c462988c3b9573692bd5f');
  var iv = b ? CryptoJS.enc.Utf8.parse(b) : CryptoJS.enc.Utf8.parse('98d71fe589499967');
  var baseResult = CryptoJS.enc.Base64.parse(endData);
  var ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
  var decryptResult = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var resData = CryptoJS.enc.Utf8.stringify(decryptResult);
  return JSON.parse(resData);
}


function get_token(rdata){
    var decryptData = dcajess(rdata.data);
    var realData = dcajess(decryptData.Data, decryptData.UTS + "000000", decryptData.UVER);
    return realData
}

