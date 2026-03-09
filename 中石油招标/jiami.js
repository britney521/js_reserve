const { JSDOM } = require('jsdom');


global.navigator = {
    userAgent: 'node.js'
};
const Encrypt = require('./jsen.js');
const { Base64 } =  require('./base64.js')


function get_data(data) {
  const datas = Base64.encode(JSON.stringify(data))
  var encryptor = new Encrypt()

  encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgJ7JiTyZJTiXFsrcBDKq3XXhJ1odkLEg/JJbul2ADG5xIarduZ84sYZTk/b0/7XdqpeAYR8CSgcQIeXfqFcotz06f7HXDN1x25lvA7ZWaFG6ULUUi8aN9orL150dXF93jAF7vgLd0fCuoe1XO5Sb8RXKna0h1Dy0bWUEBa+GJtQIDAQAB ')
  data = encryptor.encryptLong(JSON.stringify(datas))
    return data


}

function get_res(){
      var encryptor = new Encrypt()
     encryptor.setPrivateKey('MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANRW3nM43tnRfjg0l/bdOlHUbaxXMFFipe6qBeZWkzChcHU0yBvkHEAdsFuY6upUDRRxsYYWx41MLZzoL6ME0fbvyI+SOIdgsaMQvHwrOLp+LyIA4XWRG+RdQSkmFAQzdT2n++jtCaPY0fjiGx0JF9sV88F1o5oK8ZTdKnst2qB7AgMBAAECgYEAzzkvwtbfdUdjnMqG+56PCcj8d1JnjyVstmwrcc1PvAfxThECsWV+xHu03s9vgtwgH7GNBEU63gRYB2b5Bmjv1fxr6f4uGsavNYtGO6MbfwSFpV/ntik53gWNkHGQ0G81ELPRZfUqSiVYEtDQikEvnNMWRbVhyJK+1p7zPH+u/iECQQDyEsJngLSN1EWaL/9bNXLEoS0VDFlHp/uwepV5IgdVpCVToqyruEhchoDFJjZwN6K5UkOvdX9ojAfnWzpV/fdZAkEA4I4wlW+KTxcdM/ZD6/6g7WLI6P6Hh5C/L51+cOzCpOjQoYLEfH3cf+mMXOOhEIwDSs6GksOusH0AJAAem+uv8wJBANrurHP/q0w6l1iD4GcVR98eBi/rIzPzcWaC93y+kfOaqUei8Je963QDEaM8lC+ZocoJ5L1jfv+G5f8QOwpazsECQEN0k0WgrxSZJe2hEcBHykHlReMv6rifk78S+ZOkm8f8JAgQh0O6b02Bc+fHfW/CD48eQTC/Va+wrSUjYA6Im18CQAmxHoN3EEJHzby41JdJsjgbOv++zfxDE/zGaesAsq9FONSi78wvhaDvLzQUFtuTQDgMuQ6ynPEI7vYaLohCCXI= ')

          var result = encryptor.decryptLong(res)
          const ResultData = Base64.decode(result)
     return ResultData
}

console.log(get_data({
    "condition": {
        "level": 0,
        "treeMerchantType": 1,
        "keyWord": ""
    },
    "pageSize": 10
}  ))


