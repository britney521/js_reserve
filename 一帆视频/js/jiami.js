
// n ? (e = e.substring(1)) + (o ? "&" : "") + "vv=" + m.Md5.hashStr(s) + "&pub=" + t.publicKey : e + (o ? "&" : "?") + "vv=" + m.Md5.hashStr(s) + "&pub=" + t.publicKey
const { Md5 } = require('ts-md5');

// var privateKey;
// publicKeyInedx = (other Date).getTime();
// publicKey =  "CJSpCZWqDpauC2uvCJbVLLDVCpWkDpCkCZCuBZLVOJ9bEJ1YCp0uOp0nD3bYOZaoCpXaCsCuCZKmE3WrC6HVD3XYP3DXP3OpP3CrPZ8sCpKqEMKsE6HbCM4qCcKsOJ5"
// s = publicKey + "&" + '' + "&" + privateKey[publicKeyInedx % privateKey.length]
// var vv = m.Md5.hashStr(s)
// t.hashStr
// var pub = publicKey

s = 'CJSpCZWrEJ4rDIurD3HVLLDVCpWkDpCkCZCuBZLVOpSqD3WqCc5YD6CrD6LaDZbXCZasCMPZC30oCcDaCs9VDpOtEMPZCJWqCJSqCJKpDpGvPJPXPZPXOs4qDsOrP65&cinema=1&id=cwy9wuxg4zf&a=1&lang=none&usersign=1&region=us&device=1&ismastersupport=1&SpCZJSpCZWrEJ4rDIurD'

const hashValue = Md5.hashStr(s);

console.log(s); // 输出加密后的MD5值
console.log(hashValue); // 输出加密后的MD5值

