// const CryptoJS = require('crypto-js');
// const JSEncrypt = require('jsencrypt');
// /****************  配置  ****************/
// const RSA_PUB = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoDfTeS5J4qzcaF8OmikM
// qo7+0qQByPce+7kC8/mzuEWR/GbWjRWI8AhJUhkCLUIJkPri2dJ/XqkwAlP652xt
// yhx8ZY2bEN+euHrYElRREtze0xyVyeEJZEdTpTYKcT5tSyCeKZk18qSiUOtYHMNC
// CYuTrGvLYzzg7efygKZkSTWUtsdzQcvHae9wTz8eVjrh2hJY22qZ2a0DNWTfxrOc
// VTTX8YSeRt+uHP6GhqIZvjK4/9fcCH8TLud0usf8sXqn6/wqg3LnpKJuJnrMATV1
// RXrkOto5w5z+L1cxEqYWoovXHQVlu5Yy1xQdF5dcwKOjbsYAmpLqBuJcmdKmATsc
// uQIDAQAB
// -----END PUBLIC KEY-----`;
//
// const plainData = JSON.stringify({
//     "cert_id": "225",
//     "nonce": "clhyd6r9cggt2c",
//     "platform": "1",
//     "seller_id": "16f36910df490122",
//     "timestamp": "1762511768000",
//     "token": "5563d5de3ba5d26fef5ac5498bcfa7c6",
//     "type": "1",
//     "value": "gxdzcs.dingkao.cn",
//     "version": "1.1.30",
//     "sign": "c0d5cb771b098fd507c6201cf0791650"
// }); // 业务数据
// /****************************************/
//
// /* 1. 生成对称密钥 & IV */
// const key = CryptoJS.lib.WordArray.random(32);   // 256 bits
// const iv  = CryptoJS.lib.WordArray.random(16);   // 128 bits
//
// /* 2. RSA 加密对称密钥 */
// const rsa = new JSEncrypt();
// rsa.setPublicKey(RSA_PUB);
// const encryptedKeyWA = CryptoJS.enc.Hex.parse(
//         rsa.encrypt(key.toString(CryptoJS.enc.Hex))
//       ); // 先 hex → WordArray
//
// /* 3. AES-256-CBC 加密数据 */
// const encryptedWA = CryptoJS.AES.encrypt(plainData, key, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
// }).ciphertext; // 取 ciphertext WordArray
//
// /* 4. 输出结果 */
// const result = {
//   encryptedKey: encryptedKeyWA.toString(),      // hex
//   encryptedData: encryptedWA.toString(CryptoJS.enc.Base64), // Base64
//   iv: iv.toString()                             // hex
// };
//
// console.log("encryptedKey :", result.encryptedKey);
// console.log("encryptedData:", result.encryptedData);
// console.log("iv           :", result.iv);

const raw = Buffer.from(
  '08a40b051512a922800f7a05fa2b5690ae2da9a46a9bd90b588c61a1b71f3e92' +
  '8263ad8021da1fc4c4e6bbe1e08d75ae39fba34dc17752dd7629859c472472b7' +
  '0417290c204db4dbc9016e83f5a492b9d9624e687fa3e3ee74c990cf35a2574a' +
  '70265a0dbc4af6aa41320e1fd867336ba4ae85ad780abb5b6321349280dae2af' +
  'c633aa5d80e1084f47b0b99f57cad5e6a1307727d1c8c47a502bf0d14fe08691' +
  'c37c28c341c0fbcf3f6720d4b08dd1a714ccd2da982f5eebf5bcb7d069a66072' +
  '66c8435e116c320f13d3b7252c7e836a5e2dfc0696d3cd04086fa11cb7c2c3be' +
  '589213704a9c231e7fc6b0ff3a438ef1ed417bcbc2d8108798eedbc6f8ee178d',
  'hex'
);
const NodeRSA = require('node-rsa');
const key = new NodeRSA(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8i5aXCfLKsO1Z/FKn9Kc3U2Zu
M5PQ9cLKgHQKNlR7lCfLqDqBKLYc3vR3qGR8s5f1q8a9r5X3rF8o7vW5l63fF7qR
sS1v5f5q8a9r5X3rF8o7vW5l63fF7qRsS1v5f5q8a9r5X3rF8o7vW5l63fF7qR
sS1v5f5q8a9r5X3rF8o7vW5l63fF7qRsS1v5f5q8a9r5X3rF8o7vW5l63fF7qR
IDAQAB
-----END PUBLIC KEY-----`, 'pkcs8-public');

const encrypted = key.encrypt(raw, 'buffer');
const base64Out = encrypted.toString('base64');
console.log(base64Out);


{"code":0,"msg":"","time":1762561324,"data":[{"id":226,"seller_id":0,"parent_id":225,"code":"","title":"公共基础","title_sub":"","desc":"","province_id":0,"type":1,"level":2,"sort":0,"tags:0,"status":1,"create_at":"2023-10-27 16:52:47","update_at":"","children":[{"id":227,"seller_id":0,"parent_id":226,"code":"","title":"语文","title_sub":"","desc":"","province_id":0,"type":"level":3,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-27 16:52:53","update_at":""},{"id":228,"seller_id":0,"parent_id":226,"code":"","title":"数学","title_sub":"","desc":"","provie_id":0,"type":1,"level":3,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-27 16:52:57","update_at":""},{"id":229,"seller_id":0,"parent_id":226,"code":"","title":"英语","title_sub":""desc":"","province_id":0,"type":1,"level":3,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-27 16:53:01","update_at":""}]},{"id":230,"seller_id":0,"parent_id":225,"code":"","title":"职业技能","title_sub":"","desc":"","province_id":0,"type":1,"level":2,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-27 16:53:22","update_at":"","children":[{"id":231,"seller_id":0,"pat_id":230,"code":"","title":"职业适应性测试","title_sub":"","desc":"","province_id":0,"type":1,"level":3,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-27 16:57:09","update_at":""},{5,"seller_id":0,"parent_id":230,"code":"","title":"专业基础综合课","title_sub":"","desc":"","province_id":0,"type":1,"level":3,"sort":0,"tags_id":0,"status":1,"create_at":"2023-10-28 13:45pdate_at":""}]}]}
