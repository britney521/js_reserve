const CryptoJS = require('crypto-js')

// const file = "==AOxk3Nx4ERuBncYd2d5BDaZxkc5kDcuh2SYpHO0AHMl9kZFN3VHFjdzh3NadXd2ZDZxgzbvQmdtJHW3ZVewpkN610NvMkWr9SWxUGTvlVcxNHWSNnUVBTOHhGNUpHTxkXahpUUjVGWotSOUV3aYd1NWl1Z6hzdO5Uew8GVaR1VvYGaSdGaj9kQZNTZtdUQYdDeyhjWhFGZ31TPxkTZ1U2MmlzN2QDN2ATY2ITZjlTN1IGOiBjNzczYhJmY2YWMkVDMwYWOwETMyADM3QmMkBTZwADNjJmYlVGMwMGZwM2YmBDM4gzMwEDMwADOxQDZ1MGMwUDOxkjYwADM"
function PBKDF3(password, salt, cfg) {
    // 直接复用 CryptoJS 的 PBKDF2
    return CryptoJS.PBKDF2(
        password,                       // 密码（WordArray 或字符串）
        salt,                          // 盐（WordArray 或字符串）
        {
            keySize: cfg.keySize || 4,       // 4 words = 128 bit
            iterations: cfg.iterations || 1,
            hasher: cfg.hasher || CryptoJS.algo.SHA256
        }
    );
};

function iI1lliIl(IlIl1Il1) {
 return IlIl1Il1["split"]("")["reverse"]()["join"]("");
}
function lII1il11(iiI1II1) {
  return CryptoJS["AES"]["decrypt"](iI1lliIl(iliI1II1), iiI1II1, {
    "iv": CryptoJS["enc"]["Hex"]["parse"](il11Il1i),
    "mode": CryptoJS["mode"]["CBC"]
  })["toString"](CryptoJS["enc"]["Utf8"]);
}

function get_file(file){
     lil1IIlI = file["split"]("")["reverse"]()["join"]("");
    iiIIil1l = CryptoJS["enc"]["Base64"]["parse"](lil1IIlI)["toString"](CryptoJS["enc"]["Utf8"]);

    if (iiIIil1l["indexOf"]("://") != -1 || iiIIil1l["indexOf"]("$") != -1) {
      iliI1II1 = iiIIil1l;
    } else {
      var liliiiiI = iiIIil1l["substr"](-1),
          I1I1i1Il = iiIIil1l["substr"](0, liliiiiI * 8),
          i1I1iii1 = iiIIil1l["substr"](-2, 1),
          iiill1I;
      il11Il1i = iiIIil1l["substr"](I1I1i1Il["length"], 32);
      iliI1II1 = iiIIil1l["substr"](I1I1i1Il["length"] + il11Il1i["length"], iiIIil1l["length"] - I1I1i1Il["length"] - il11Il1i["length"] - 2);
      iiill1I = PBKDF3("Û3Áf÷ÁfN[Üقراءة", CryptoJS["enc"]["Hex"]["parse"](I1I1i1Il), {
        "keySize": 4,
        "iterations": i1I1iii1,
        "hasher": CryptoJS["algo"]["SHA256"]
      });
      iliI1II1 = CryptoJS["enc"]["Base64"]["parse"](lII1il11(iiill1I))["toString"](CryptoJS["enc"]["Utf8"]);
    }

    IilI1Il = iliI1II1["split"]("$");
    return IilI1Il
}

// IliIIil1 = parent["window"]["innerWidth"],
//     ii1l11Il = parent["window"]["innerHeight"],

function headers(tingid,noteid,sgin){
      var iIiiliII = CryptoJS["MD5"](tingid + "**" + sgin + "**" + noteid)["toString"](),
      i1ii1lli = Number(Math["round"](new Date() / 1000))["toString"](16)["split"]("")["reverse"]()["join"]("")

    s1 = CryptoJS["MD5"](iIiiliII["substr"](10, 18))["toString"]()
    s2 = i1ii1lli
    s3 = CryptoJS["enc"]["Base64"]["stringify"](CryptoJS["enc"]["Utf8"]["parse"](iIiiliII + "@" + 'ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Pro, Unspecified Version)' + "@" + 'MacIntel' + "@" + 1869 + "*" + 844 + "@" + i1ii1lli))["split"]("")["reverse"]()["join"]("")
    return {
         s1,
         s2,
         s3,
    }
}

// console.log(headers('2274','1','04c097cca4b357df63194a27987aa92f'))

