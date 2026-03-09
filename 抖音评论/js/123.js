var str = '17608452941181';
var codes = Array.from(str, ch => ch.charCodeAt(0));
console.log(codes);
var char = String.fromCharCode(...[48,54,54,48,56,52,52,50,56,52,48,48,56,48]); // 根据字符编码获取字符
console.log(char); // 输出 'a'


let decimalArray = [
  1937770108,  // 0x736d616a
  1983173321,  // 0x764e6a69
  385893078,   // 0x170c0a56
  3666375988,  // 0xda9a0a44
  2701930684,  // 0xa0f0f0fc
  353449901,   // 0x150f0f0d
  3816598093,  // 0xe38dee4d
  4008382286   // 0xee0f0f0e
];
let hexString = "";

for (let i = 0; i < decimalArray.length; i++) {
    hexString += decimalArray[i].toString(16) + '\n';
}

console.log(hexString); // 输出: ff0a100
 // 插桩 日志 json 打印
// JSON.stringify(S, function(key, value) {if (value == window) {return undefined} return value})

