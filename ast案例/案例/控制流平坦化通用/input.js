var IilllIi1 = "0|1|2|3|4"["split"]('|'),
      lIIl1111 = 0x0;
    while (!![]) {
      switch (IilllIi1[lIIl1111++]) {
        case '0':
          lil1IIlI = function (I1i1Iili, IIIIiii) {
            return I1i1Iili(IIIIiii);
          }(iI1lliIl, lllIIi11["file"]);
          continue;
        case '1':
          iiIIil1l = lIIliilI["enc"]["Base64"]["parse"](lil1IIlI)["toString"](lIIliilI['enc']["Utf8"]);
          continue;
        case '2':
          if (function (Ili1Ill, i1lIli1I) {
            return Ili1Ill != i1lIli1I;
          }(iiIIil1l['indexOf']('://'), -0x1) || iiIIil1l["indexOf"]('$') != -0x1) iliI1II1 = iiIIil1l;else {
            var I11liil = '4|3|0|1|2'["split"]('|'),
              lIl1iiiI = 0x0;
            while (!![]) {
              switch (I11liil[lIl1iiiI++]) {
                case '0':
                  iliI1II1 = iiIIil1l['substr'](I1I1i1Il["length"] + il11Il1i["length"], function (l1Ill1I1, li11liii) {
                    return l1Ill1I1 - li11liii;
                  }(function (iI11ll, ill11il) {
                    return iI11ll - ill11il;
                  }(iiIIil1l["length"], I1I1i1Il['length']), il11Il1i['length']) - 0x2);
                  continue;
                case '1':
                  iiill1I = lIIliilI["PBKDF3"]("\xDB3\xC1f\xF7\x17\xC1fN[\xDC\x14\u0642\u0631\u0627\u0621\u0629\x14\x86", lIIliilI['enc']["Hex"]['parse'](I1I1i1Il), {
                    'keySize': 0x4,
                    'iterations': i1I1iii1,
                    'hasher': lIIliilI["algo"]["SHA256"]
                  });
                  continue;
                case '2':
                  iliI1II1 = lIIliilI["enc"]["Base64"]['parse'](function (iil1, l1liI1II) {
                    return iil1(l1liI1II);
                  }(lII1il11, iiill1I))["toString"](lIIliilI['enc']["Utf8"]);
                  continue;
                case '3':
                  il11Il1i = iiIIil1l["substr"](I1I1i1Il['length'], 0x20);
                  continue;
                case '4':
                  var liliiiiI = iiIIil1l["substr"](-0x1),
                    I1I1i1Il = iiIIil1l['substr'](0x0, function (iI11IIi, lillIii1) {
                      return iI11IIi * lillIii1;
                    }(liliiiiI, 0x8)),
                    i1I1iii1 = iiIIil1l["substr"](-0x2, 0x1),
                    iiill1I;
                  continue;
              }
              break;
            }
          }
          continue;
        case '3':
          IilI1Il = iliI1II1["split"]('$');
          continue;
        case '4':
          lllIIi11["file"] = '';
          continue;
      }
      break;
    }