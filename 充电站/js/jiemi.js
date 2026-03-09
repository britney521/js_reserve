window = global;
const CryptoJS = require('crypto-js')

function decryptAES(endData, keyStr, ivStr) {
  // Default keys if not provided
  const defaultKey = "ErYu78ijuVaM7Y0UqwvpO738uNC9ALF7";
  const defaultIv = "Ol9mqvZ6ijnytr7O";

  // Parse key and IV (use provided values or defaults)
  const key = CryptoJS.enc.Utf8.parse(keyStr || defaultKey);
  const iv = CryptoJS.enc.Utf8.parse(ivStr || defaultIv);

  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(
    endData,  // Base64 encoded ciphertext
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

   var resData = CryptoJS.enc.Utf8.stringify(decrypted);
  return JSON.parse(resData);
}


function get_real_data(rdata){
    var decryptData = decryptAES(rdata.data);
    console.log(decryptData)
    var realData = decryptAES(decryptData.Data, decryptData.UTS + "000000", decryptData.UVER);
    console.log(realData)
    return realData
}
