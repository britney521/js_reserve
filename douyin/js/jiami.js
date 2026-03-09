const CryptoJS = require('Crypto-JS');
window = this;
const JSEncrypt = require('jsencrypt')


const Fi = a => {
    // let e = hr();
    let encrypt = new JSEncrypt();
    return encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkJZWIUIje8VjJ3okESY8stCs/a95hTUqK3fD/AST0F8mf7rTLoHCaW+AjmrqVR9NM/tvQNni67b5tGC5z3PD6oROJJ24QfcAW9urz8WjtrS/pTAfGeP/2AMCZfCu9eECidy16U2oQzBl9Q0SPoz0paJ9AfgcrHa0Zm3RVPL7JvOUzscL4AnirYImPsdaHZ52hAwz5y9bYoiWzUkuG7LvnAxO6JHQ71B3VTzM3ZmstS7wBsQ4lIbD318b49x+baaXVmC3yPW/E4Ol+OBZIBMWhzl7FgwIpgbGmsJSsqrOq3D8IgjS12K5CgkOT7EB/sil7lscgc22E5DckRpMYRG8dwIDAQAB')//此处为RSA公钥，public.pem
,encrypt.encrypt(a) + ""
}
// const k2 = "D/u2iqtKSL8HAawqfjFV5a7kzrDZeK9d4e0FDvHoPYixWS4XWVqQP9YUFOs/QnVhjJX+1s96fdBntK5y78tWp41sXT7CyH9beOlq3JMXjvG4mZmy5P32BT67eK0P0VAIag9oz6ixvjtNfMMnCXsbjN+Z4Qw6q++yPLxFgHAPK9yD0VWoN3f29oFKZ3UbTWjrUsS7T6EITCU+i8ndlmj1OWVOnhgWKEy5QggOlm8B46962PRitd17wFEiItPgWAEh52548uDuTuiSeOxFB9qBGO/vc1rLCPK750pp251fi9Oqag0CbRftYRB4Wqi4eyA0zLX0XjeNHcgjVNhrrLTvbA=="
const mi = (a, e, t) => {
    let r = CryptoJS.enc.Utf8.parse(e)
        , s = CryptoJS.enc.Utf8.parse(atob(t));
    return CryptoJS.AES.encrypt(a, r, {
        iv: s,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
}
// function useReqPublicKey() {
//             const e = await Do("/auth/keys", {
//                 method: "get"
//             });
//             if (e.code !== 200)
//                 return Promise.resolve(e.message);
//             this.publicKey = e.data.k1,
//             this.k2 = e.data.k2
//         }


function get_sign(body){
    // var body = {
    // "url": "https://www.douyin.com/video/7414000660821167369"
    // }
    // var h = c(r.k2)
    var h = "kedou@8989!63239"
    var m = mi(JSON.stringify(body), h, "a2Vkb3VAODk4OSE2MzIzMw==")
    var sign = Fi(m)
    console.log(sign)
    return sign
}

console.log(get_sign())