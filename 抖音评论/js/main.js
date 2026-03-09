require('./env.js');
require('./bms.js');


function get_fp() {
    var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")
      , t = e.length
      , n = Date.now().toString(36)
      , r = [];
    r[8] = r[13] = r[18] = r[23] = "_",
    r[14] = "4";
    for (var o = 0, i = void 0; o < 36; o++)
        r[o] || (i = 0 | Math.random() * t,
        r[o] = e[19 == o ? 3 & i | 8 : i]);
    return "verify_" + n + "_" + r.join("")
}

function get_ms_token(length = 182) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return encodeURIComponent(result);
}

const t = {
    "aid": 6383,
    "pageId": 6241,
    "paths": [
        "^/webcast/",
        "^/aweme/v1/",
        "^/aweme/v2/",
        "/douplus/",
        "/v1/message/send",
        "^/live/",
        "^/captcha/",
        "^/ecom/"
    ],
    "boe": false,
    "ddrt": 8.5,
    "ic": 8.5
}


window.bdms.init(t)
console.log('abgous:',window.a_bogus)
