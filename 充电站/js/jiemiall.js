const CryptoJS = require('crypto-js')


window = global;


function _dcajess(endData, a, b) {

  var key = a ? CryptoJS.enc.Utf8.parse(a) : CryptoJS.enc.Utf8.parse('ErYu78ijuVaM7Y0UqwvpO738uNC9ALF7');
  var iv = b ? CryptoJS.enc.Utf8.parse(b) : CryptoJS.enc.Utf8.parse("Ol9mqvZ6ijnytr7O");
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
function b_dcajess(result) {
  var decryptData = _dcajess(result.data);
  var realData = _dcajess(decryptData.Data, decryptData.UTS + "000000", decryptData.UVER);
  return realData;
}

const {unzip}  = require('./js/unzip.js')
function get_all_data(res){
    var decryptData = b_dcajess(res);
    return unzip(decryptData)
}







