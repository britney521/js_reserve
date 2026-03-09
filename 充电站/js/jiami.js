window = global;
const CryptoJS = require('crypto-js')


var maxDigits;
var ZERO_ARRAY;
var bigZero, bigOne;
var biRadixBase = 2;
var biRadixBits = 16;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << 16; // = 2^16 = 65536
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxInteger = 9999999999999998;

var lowBitMasks = new Array(0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF);

var hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');


function reverseStr(s) {
  var result = "";
  for (var i = s.length - 1; i > -1; --i) {
    result += s.charAt(i);
  }
  return result;
}
function digitToHex(n) {
  var mask = 0xf;
  var result = "";
  for (var i = 0; i < 4; ++i) {
    result += hexToChar[n & mask];
    n >>>= 4;
  }
  return reverseStr(result);
}
function biToHex(x) {
  var result = "";
  var n = biHighIndex(x);
  for (var i = biHighIndex(x); i > -1; --i) {
    result += digitToHex(x.digits[i]);
  }
  return result;
}
function biModuloByRadixPower(x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, 0, n);
  return result;
}
function biCompare(x, y) {
  if (x.isNeg != y.isNeg) {
    return 1 - 2 * Number(x.isNeg);
  }
  for (var i = x.digits.length - 1; i >= 0; --i) {
    if (x.digits[i] != y.digits[i]) {
      if (x.isNeg) {
        return 1 - 2 * Number(x.digits[i] > y.digits[i]);
      } else {
        return 1 - 2 * Number(x.digits[i] < y.digits[i]);
      }
    }
  }
  return 0;
}
function biDivideByRadixPower(x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
  return result;
}
function biMultiply(x, y) {
  var result = new BigInt();
  var c;
  var n = biHighIndex(x);
  var t = biHighIndex(y);
  var u, uv, k;
  for (var i = 0; i <= t; ++i) {
    c = 0;
    k = i;
    for (var j = 0; j <= n; ++j, ++k) {
      uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
      result.digits[k] = uv & maxDigitVal;
      c = uv >>> biRadixBits;
      //c = Math.floor(uv / biRadix);
    }

    result.digits[i + n + 1] = c;
  }
  // Someone give me a logical xor, please.
  result.isNeg = x.isNeg != y.isNeg;
  return result;
}
function BarrettMu_multiplyMod(x, y) {
  /*
   x = this.modulo(x);
   y = this.modulo(y);
   */
  var xy = biMultiply(x, y);
  return this.modulo(xy);
}
function BarrettMu_powMod(x, y) {
  var result = new BigInt();
  result.digits[0] = 1;
  var a = x;
  var k = y;
  while (true) {
    if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
    k = biShiftRight(k, 1);
    if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
    a = this.multiplyMod(a, a);
  }
  return result;
}
function BarrettMu_modulo(x) {
  var q1 = biDivideByRadixPower(x, this.k - 1);
  var q2 = biMultiply(q1, this.mu);
  var q3 = biDivideByRadixPower(q2, this.k + 1);
  var r1 = biModuloByRadixPower(x, this.k + 1);
  var r2term = biMultiply(q3, this.modulus);
  var r2 = biModuloByRadixPower(r2term, this.k + 1);
  var r = biSubtract(r1, r2);
  if (r.isNeg) {
    r = biAdd(r, this.bkplus1);
  }
  var rgtem = biCompare(r, this.modulus) >= 0;
  while (rgtem) {
    r = biSubtract(r, this.modulus);
    rgtem = biCompare(r, this.modulus) >= 0;
  }
  return r;
}

function biShiftRight(x, n) {
  var digitCount = Math.floor(n / bitsPerDigit);
  var result = new BigInt();
  arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
  var bits = n % bitsPerDigit;
  var leftBits = bitsPerDigit - bits;
  for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
    result.digits[i] = result.digits[i] >>> bits | (result.digits[i1] & lowBitMasks[bits]) << leftBits;
  }
  result.digits[result.digits.length - 1] >>>= bits;
  result.isNeg = x.isNeg;
  return result;
}

function biMultiplyDigit(x, y) {
  var n, c, uv;
  var result = new BigInt();
  n = biHighIndex(x);
  c = 0;
  for (var j = 0; j <= n; ++j) {
    uv = result.digits[j] + x.digits[j] * y + c;
    result.digits[j] = uv & maxDigitVal;
    c = uv >>> biRadixBits;
    //c = Math.floor(uv / biRadix);
  }

  result.digits[1 + n] = c;
  return result;
}

function biSubtract(x, y) {
  var result;
  if (x.isNeg != y.isNeg) {
    y.isNeg = !y.isNeg;
    result = biAdd(x, y);
    y.isNeg = !y.isNeg;
  } else {
    result = new BigInt();
    var n, c;
    c = 0;
    for (var i = 0; i < x.digits.length; ++i) {
      n = x.digits[i] - y.digits[i] + c;
      result.digits[i] = n % biRadix;
      // Stupid non-conforming modulus operation.
      if (result.digits[i] < 0) result.digits[i] += biRadix;
      c = 0 - Number(n < 0);
    }
    // Fix up the negative sign, if any.
    if (c == -1) {
      c = 0;
      for (var i = 0; i < x.digits.length; ++i) {
        n = 0 - result.digits[i] + c;
        result.digits[i] = n % biRadix;
        // Stupid non-conforming modulus operation.
        if (result.digits[i] < 0) result.digits[i] += biRadix;
        c = 0 - Number(n < 0);
      }
      // Result is opposite sign of arguments.
      result.isNeg = !x.isNeg;
    } else {
      // Result is same sign.
      result.isNeg = x.isNeg;
    }
  }
  return result;
}
function biCompare(x, y) {
  if (x.isNeg != y.isNeg) {
    return 1 - 2 * Number(x.isNeg);
  }
  for (var i = x.digits.length - 1; i >= 0; --i) {
    if (x.digits[i] != y.digits[i]) {
      if (x.isNeg) {
        return 1 - 2 * Number(x.digits[i] > y.digits[i]);
      } else {
        return 1 - 2 * Number(x.digits[i] < y.digits[i]);
      }
    }
  }
  return 0;
}

function biMultiplyByRadixPower(x, n) {
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
  return result;
}
function arrayCopy(src, srcStart, dest, destStart, n) {
  var m = Math.min(srcStart + n, src.length);
  for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
    dest[j] = src[i];
  }
}
var highBitMasks = new Array(0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800, 0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0, 0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF);

function biShiftLeft(x, n) {
  var digitCount = Math.floor(n / bitsPerDigit);
  var result = new BigInt();
  arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
  var bits = n % bitsPerDigit;
  var rightBits = bitsPerDigit - bits;
  for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
    result.digits[i] = result.digits[i] << bits & maxDigitVal | (result.digits[i1] & highBitMasks[bits]) >>> rightBits;
  }
  result.digits[0] = result.digits[i] << bits & maxDigitVal;
  result.isNeg = x.isNeg;
  return result;
}

function biNumBits(x) {
  var n = biHighIndex(x);
  var d = x.digits[n];
  var m = (n + 1) * bitsPerDigit;
  var result;
  for (result = m; result > m - bitsPerDigit; --result) {
    if ((d & 0x8000) != 0) break;
    d <<= 1;
  }
  return result;
}

function biDivideModulo(x, y) {
  var nb = biNumBits(x);
  var tb = biNumBits(y);
  var origYIsNeg = y.isNeg;
  var q, r;
  if (nb < tb) {
    // |x| < |y|
    if (x.isNeg) {
      q = biCopy(bigOne);
      q.isNeg = !y.isNeg;
      x.isNeg = false;
      y.isNeg = false;
      r = biSubtract(y, x);
      // Restore signs, 'cause they're references.
      x.isNeg = true;
      y.isNeg = origYIsNeg;
    } else {
      q = new BigInt();
      r = biCopy(x);
    }
    return new Array(q, r);
  }
  q = new BigInt();
  r = x;

  // Normalize Y.
  var t = Math.ceil(tb / bitsPerDigit) - 1;
  var lambda = 0;
  while (y.digits[t] < biHalfRadix) {
    y = biShiftLeft(y, 1);
    ++lambda;
    ++tb;
    t = Math.ceil(tb / bitsPerDigit) - 1;
  }
  // Shift r over to keep the quotient constant. We'll shift the
  // remainder back at the end.
  r = biShiftLeft(r, lambda);
  nb += lambda; // Update the bit count for x.
  var n = Math.ceil(nb / bitsPerDigit) - 1;
  var b = biMultiplyByRadixPower(y, n - t);
  while (biCompare(r, b) != -1) {
    ++q.digits[n - t];
    r = biSubtract(r, b);
  }
  for (var i = n; i > t; --i) {
    var ri = i >= r.digits.length ? 0 : r.digits[i];
    var ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
    var ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
    var yt = t >= y.digits.length ? 0 : y.digits[t];
    var yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
    if (ri == yt) {
      q.digits[i - t - 1] = maxDigitVal;
    } else {
      q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
    }
    var c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
    var c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
    while (c1 > c2) {
      --q.digits[i - t - 1];
      c1 = q.digits[i - t - 1] * (yt * biRadix | yt1);
      c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
    }
    b = biMultiplyByRadixPower(y, i - t - 1);
    r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
    if (r.isNeg) {
      r = biAdd(r, b);
      --q.digits[i - t - 1];
    }
  }
  r = biShiftRight(r, lambda);
  // Fiddle with the signs and stuff to make sure that 0 <= r < y.
  q.isNeg = x.isNeg != origYIsNeg;
  if (x.isNeg) {
    if (origYIsNeg) {
      q = biAdd(q, bigOne);
    } else {
      q = biSubtract(q, bigOne);
    }
    y = biShiftRight(y, lambda);
    r = biSubtract(y, r);
  }
  // Check for the unbelievably stupid degenerate case of r == -0.
  if (r.digits[0] == 0 && biHighIndex(r) == 0) r.isNeg = false;
  return new Array(q, r);
}
function biDivide(x, y) {
  return biDivideModulo(x, y)[0];
}

function BigInt(flag) {
  if (typeof flag == "boolean" && flag == true) {
    this.digits = null;
  } else {
    this.digits = ZERO_ARRAY.slice(0);
  }
  this.isNeg = false;
}

function biCopy(bi) {
  var result = new BigInt(true);
  result.digits = bi.digits.slice(0);
  result.isNeg = bi.isNeg;
  return result;
}

function biHighIndex(x) {
  var result = x.digits.length - 1;
  while (result > 0 && x.digits[result] == 0) --result;
  return result;
}

function BarrettMu(m) {
  this.modulus = biCopy(m);
  this.k = biHighIndex(this.modulus) + 1;
  var b2k = new BigInt();
  b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
  this.mu = biDivide(b2k, this.modulus);
  this.bkplus1 = new BigInt();
  this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
  this.modulo = BarrettMu_modulo;
  this.multiplyMod = BarrettMu_multiplyMod;
  this.powMod = BarrettMu_powMod;
}

function charToHex(c) {
  var ZERO = 48;
  var NINE = ZERO + 9;
  var littleA = 97;
  var littleZ = littleA + 25;
  var bigA = 65;
  var bigZ = 65 + 25;
  var result;
  if (c >= ZERO && c <= NINE) {
    result = c - ZERO;
  } else if (c >= bigA && c <= bigZ) {
    result = 10 + c - bigA;
  } else if (c >= littleA && c <= littleZ) {
    result = 10 + c - littleA;
  } else {
    result = 0;
  }
  return result;
}
function biFromHex(s) {
  var result = new BigInt();
  var sl = s.length;
  for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
    result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
  }
  return result;
}

function hexToDigit(s) {
  var result = 0;
  var sl = Math.min(s.length, 4);
  for (var i = 0; i < sl; ++i) {
    result <<= 4;
    result |= charToHex(s.charCodeAt(i));
  }
  return result;
}
function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
  this.e = biFromHex(encryptionExponent);
  this.d = biFromHex(decryptionExponent);
  this.m = biFromHex(modulus);

  this.digitSize = 2 * biHighIndex(this.m) + 2;
  this.chunkSize = this.digitSize - 11; // maximum, anything lower is fine
  ////////////////////////////////// TYF

  this.radix = 16;
  this.barrett = new BarrettMu(this.m);
}
function BigInt(flag) {
  if (typeof flag == "boolean" && flag == true) {
    this.digits = null;
  } else {
    this.digits = ZERO_ARRAY.slice(0);
  }
  this.isNeg = false;
}

function encryptedString(key, s) {
  ////////////////////////////////// TYF
  if (key.chunkSize > key.digitSize - 11) {
    return "Error";
  }
  ////////////////////////////////// TYF

  var a = new Array();
  var sl = s.length;
  var i = 0;
  while (i < sl) {
    a[i] = s.charCodeAt(i);
    i++;
  }

  //while (a.length % key.chunkSize != 0) {
  //	a[i++] = 0;
  //}

  var al = a.length;
  var result = "";
  var j, k, block;
  for (i = 0; i < al; i += key.chunkSize) {
    block = new BigInt();
    j = 0;

    //for (k = i; k < i + key.chunkSize; ++j) {
    //	block.digits[j] = a[k++];
    //	block.digits[j] += a[k++] << 8;
    //}

    ////////////////////////////////// TYF
    // Add PKCS#1 v1.5 padding
    // 0x00 || 0x02 || PseudoRandomNonZeroBytes || 0x00 || Message
    // Variable a before padding must be of at most digitSize-11
    // That is for 3 marker bytes plus at least 8 random non-zero bytes
    var x;
    var msgLength = i + key.chunkSize > al ? al % key.chunkSize : key.chunkSize;

    // Variable b with 0x00 || 0x02 at the highest index.
    var b = new Array();
    for (x = 0; x < msgLength; x++) {
      b[x] = a[i + msgLength - 1 - x];
    }
    b[msgLength] = 0; // marker
    var paddedSize = Math.max(8, key.digitSize - 3 - msgLength);
    for (x = 0; x < paddedSize; x++) {
      b[msgLength + 1 + x] = Math.floor(Math.random() * 254) + 1; // [1,255]
    }
    // It can be asserted that msgLength+paddedSize == key.digitSize-3
    b[key.digitSize - 2] = 2; // marker
    b[key.digitSize - 1] = 0; // marker

    for (k = 0; k < key.digitSize; ++j) {
      block.digits[j] = b[k++];
      block.digits[j] += b[k++] << 8;
    }
    ////////////////////////////////// TYF

    var crypt = key.barrett.powMod(block, key.e);
    var text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
    result += text + " ";
  }
  return result.substring(0, result.length - 1); // Remove last space.
}

function setMaxDigits(value) {
  maxDigits = value;
  ZERO_ARRAY = new Array(maxDigits);
  for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
  bigZero = new BigInt();
  bigOne = new BigInt();
  bigOne.digits[0] = 1;
}
function generateWVER(t) {
    const __c = "010001";
    const __d = "C2D84A72668932EBE5CC2BADB5DE288E59AD587775C1E45F33F6CC9DAB376C793AFF12050C0648D5C3016F685B9F4FA2460A59B6B07793808B4E68A883CA2830FD7895C66F68F64A829DB99DEDE978EC2E04711184A872C1F43956B1B72CFA803C1D677BAE386209368B3F3ED7A8CB06BEC64B0D0369EE62A49E6B417FC55959";
    setMaxDigits(129)
    const key = new RSAKeyPair(__c, '', __d)
    let dtime = t;
     tempdt = encryptedString(key, dtime + "")
    // let timeDiff = localStorage.getItem('teldTTT') || 0;
    //
    // // Calibrate time if server time is provided
    // if (time) {
    //     timeDiff = time - dtime;
    //     localStorage.setItem('teldTTT', timeDiff);
    // }
    //
    // dtime += Number(timeDiff);

    // Encrypt timestamp using RSA
    if (tempdt.length < 256) {
            paddingLength = 256 - tempdt.length;
            paddingList = [];
            for (i = 0; i < paddingLength; i++) {
              paddingList.push(0);
            }
            tempdt = paddingList.join('') + tempdt;
          }
    return tempdt
}
// console.log(generateWVER())


function _cajess(endData, a, b) {
  window._e = "ErYu78ijuVaM7Y0UqwvpO738uNC9ALF7";
  window._f = "Ol9mqvZ6ijnytr7O";
  var key = a ? CryptoJS.enc.Utf8.parse(a) : CryptoJS.enc.Utf8.parse(window.__e);
  var iv = b ? CryptoJS.enc.Utf8.parse(b) : CryptoJS.enc.Utf8.parse(window.__f);
  var encryptResult = CryptoJS.AES.encrypt(endData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encryptResult.ciphertext);
}
function randomNum(n) {
  var rnd = "";
  for (var i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  return rnd;
}
// 单个充电站加密参数
function b_cajess(param) {
  var uts = Math.round(new Date().getTime() / 1000) + "";
  var uver = _cajess(uts).substring(0, 16);
  var paramAfterEdit = _cajess(JSON.stringify(param), uts + "000000", uver);
  return JSON.stringify({
    Data: paramAfterEdit,
    UTS: uts,
    UVER: uver,
    UUID: new Date().getTime() + "" + randomNum(10)
  });
}

// info = {id:'b18bc693-60aa-41a8-bb1c-a28af5c7e6a5',stationType:'1'}
// console.log(b_cajess(info))





function AesEncode(param) {
  var ret = {};
  var paramkey = param.paramName;
  var paramData = param.paremData;
  if (Array.isArray(paramkey)) {
    for (var i = 0; i < paramkey.length; i++) {
      ret[paramkey[i]] = b_cajess(paramData[i]);
    }
  } else {
    ret[paramkey] = b_cajess(paramData);
  }
  return ret;
}

// 全部充电站加密参数
function get_params(){
    var postData = Object.assign({
          TELDAppID: ""
        }, AesEncode({
          paramName: "param",
          paremData: JSON.stringify(Object.assign({
            keyword: "",
            stationType: "",
            //电站类型
            chargeType: ""
          }))
        }));

    return postData
}

// console.log(b_cajess('{"id":"8154fe42-e02b-4035-9f0e-ea3f1f91f5d6","stationType":"1"}'))

