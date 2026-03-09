let parse = require('@babel/parser').parse;
let generate = require("@babel/generator").default;
let traverse = require("@babel/traverse").default;
const types = require("@babel/types");
let fs = require('fs');

let js_code = fs.readFileSync("input/jsjiami.js", "utf-8")
const ast = parse(js_code, {
    sourceType: 'script',
    plugins: ['jsx']
});

var bigarry =
   [
    "W4WsihGs",
    "W6ZdMmoTpGSJW6ZdMW",
    "WOxcIrtdSCom",
    "wq/cTmkCpW",
    "sXZdPCo5WOxcJLzA",
    "jNXJtSoNWRG",
    "DtWfWQpdGq",
    "W63cVhqlW592WQeIwG",
    "rGFdO8o+WONcN1fbWRvw",
    "yCkzFIBdTq",
    "WRXDwdm+",
    "xvSOW5aY",
    "WRhcI8o1WPVcVW",
    "WQdcUXlcPa",
    "FSojWQJdGCo3",
    "wNHivGxdQa",
    "nZDmBmkrWOJdJmoTW61CWRau",
    "ht1A",
    "CCoeWPtcTx12W7NdVgvmWP1T",
    "W4FdJConzge",
    "k8o6BxHn",
    "be53uCoy",
    "W6hdRCos",
    "r8o8WOJdPCoRW5Tl",
    "kthcGSkPea",
    "sGpdVmkMfq",
    "WQdcTW/cT8oWza",
    "ievhCCoH",
    "W7ZcVxmBW5r6WQeZ",
    "W4K2WQlcUGycW45WcNjIWQrGht3cVa",
    "eWiWWQO",
    "W7dcQq3cQrFcLh3dJhRcGX0z",
    "hmoTBWi",
    "W43dHJddJSoM",
    "cZxcPuKBWPy",
    "xwPCW6FdIHa",
    "W63dM8oJBgW",
    "WQldQdFcNrdcRhJdTG",
    "sCoycCkumq",
    "WPRcNqtdVSomWOOZwW",
    "dCkuFmoJomoTx8o+zJq",
    "A8oeW51j",
    "W63dQmkvw13dLq",
    "WPRdMYtcTG",
    "WO7dT8k8tr0",
    "rMeNW4Wj",
    "Cfu3W6qp",
    "5OoS55M36kYC6zwJ6l6c5lUn6AcT57UU77YD6k+Y566x5B6o5PwK5lIQ5Bcn5PAn5zod5yEO5Q6o6k2P6zsp",
    "lSkCW4RdOW",
    "CSkqEIVdUa",
    "aqFcOeTy",
    "W5/dUSkMjCo0",
    "xmk/WQucgG",
    "WP5BAdGQ",
    "WRPpWOldKaW0gqBdLsJdJG",
    "ah1Nbq",
    "W4TFsMqGdr3cJa",
    "ndFcM0RcI8k6WPVdHmkqWOvHWQ7ySTQ427lBUnUnbt0",
    "W7ZdK8o5z2JcImke",
    "WOjpmeKf",
    "ymktWOxdJCodW73dOsGSWOhcQq",
    "EsZcL8k4ccS",
    "vSkWwa/dQ2jrW695",
    "W5RcQW/cJc0",
    "CKicW6eH",
    "hqpcKe10",
    "ECo6hmk+ga",
    "W6BdPLJdQmkGCf8ktSoBWRy",
    "WOvBFsy/vCklEG",
    "WR7cOCoZWP7cIG",
    "xahdPq",
    "W5CjWO7dLKu",
    "W5xcJmoRW4RcP8okhtbCzG",
    "W5FdTmoFswa",
    "WOjeqJS5",
    "jSkzzq",
    "BZyMWQFdOG",
    "WQLeqdec",
    "6lwT5RUT6kEh5P+I5AAk6lAy776j",
    "WQjTle0p",
    "W7GBW4hcRveNmq8",
    "mmkCW7ddUtCQW5ldIa",
    "W6xdS8kfvKRdQmkj",
    "FZ8+WP3dUa",
    "xSoThSksfG",
    "FJ3cJSk4",
    "tSoFWQhdS8og",
    "sSk9WRSeha",
    "W7BdLmoDDu0",
    "vCofW7jsla",
    "WPhdNYVcTxW",
    "xCoAhCktaNuZ",
    "W4tdJSo6DMe",
    "EJtcL8k1hZNdNsqDWRpcLqS",
    "WQNdIaxcVh4",
    "j8kkWQ8",
    "tmkFWQmFma",
    "W7O3WQRdOq",
    "tmkfWQDskmkHW7TuW4hcQSkTW7Pg",
    "WPlcUrdcTCoj",
    "gmodW5dcJmk1",
    "tbNdR8k7jgf/WRmyFG",
    "WRVdU8orkX0JW6ZdMW",
    "sSowWOZdPW",
    "WOzBxdy+",
    "ngvKt8oN",
    "WP7dMIJcH3a",
    "dmk6tCoeoq",
    "W64IWRBdSW",
    "fmowWRBdTCkM",
    "W73dHmo5",
    "qXZdPCoTWPZcGLDa",
    "w0Lbqaq",
    "W5ntvhuWaX0",
    "bSkGWQud",
    "WOlcRrNdKmoo",
    "lCkGW6/dLYC",
    "W7FcRHBcQW",
    "WQxcJYVcNmoP",
    "BCosWQVdKca",
    "DsC7WQhcM1K",
    "W7aLWRhdO2yi",
    "kCoQWPJdV8k6W6hdPa",
    "W7VdOapdQCoE",
    "r0fkuXpdUKu",
    "W6fdqfmG",
    "xWvIc8oF",
    "W4SnlLC",
    "qNPtW7tdJaP9W47cPwVcG8okqNW",
    "W6tdUmkivfRdKW",
    "iSoEWPddNCkVW6xdPra",
    "wXtdTSk9",
    "W4ywWPRdSe4",
    "aCkED8o0gmo2",
    "WQlcQYFdJSo5",
    "gCkAWQblha",
    "wmo2WQldKSo2W5zaya",
    "kSouWPddU8k7W4VdSa",
    "WRhcPGlcTCoPDeqRyW",
    "yg19W4BdHq",
    "W4tdOLCyaa",
    "WRVdTdVcM04",
    "W5pcGh5Nsa",
    "WOX2p00iW4G",
    "maOQWRSZ",
    "W61csX4",
    "E1DfAbO",
    "rCk7uG",
    "ASkhW4ZdVwGWW5NdMW",
    "zLeX",
    "W7/dLx0fiq",
    "bIqlWO8f",
    "tSkSWQud",
    "W64qW5y",
    "r8oTW4L3iW",
    "m8o3W4JcVCkx",
    "aCkjW6VdGIK",
    "yuOMW6yE",
    "jSoSFv9qWO8AoSoblW",
    "wqFdQ8kXaa",
    "hJFdNuSUdSktW4ldNCkOW6bP",
    "sSkHWRilhCkqqG",
    "q8o0W69hjNn2W4VdTCkK",
    "WOVdK8kXWPxcRCoKaJX9tmk/oSk5",
    "WPldOIBcS2apWQ4",
    "W67cJwLWBW",
    "W73dMmoKFgBcLSke",
    "W4/cJN1Gs8kCW7RcG8kQ",
    "W5ZcOSkDWOJcPL7cNa",
    "W4OTWQ8",
    "WQZdKmk8Eae",
    "xd/cNSk5kq",
    "wgxcIqD/vmk4WRZdMCkaW5z8nG",
    "W7FcV0XkxG",
    "W6emW63cT3y",
    "nSkHWQDMkq",
    "W7VdG8kVh8oq",
    "WP3dHmoBobW",
    "f8kRWRu",
    "xwxcSbrL",
    "qq9bfa",
    "WOxdKCk1WPu",
    "W6GrW5VcK0aXlq3dLHddSq",
    "W63dKSo+rMFcJSkeW6ezWRHT",
    "W7dcS2mgW5XT",
    "WRBcMdhcHCoB",
    "W4ldTSkKW7NcPf/cJ8kAdG8",
    "uSoCWP7dTW",
    "j8oRW7FcHSkh",
    "vMDvW7FdHafNW74",
    "hSkDB8oIhG",
    "WO3dTCoXoLL+",
    "jmotW5e",
    "tCoFWPRdTs1EWPW",
    "WR7dP8kXWRJcPa",
    "WO3dK8k7WO4",
    "W5ZcPCkC",
    "W614F2Gp",
    "WOnrxtC5",
    "mdVcL2H6",
    "WOFcOCodWRNcLfpcTCkB",
    "lG9OzmkK",
    "W5pcS8kbWOpcMvm",
    "W44gl0SD",
    "oSoTzKO",
    "oCopA1HG",
    "W73cT8kCWOhdMW8",
    "WRZdS8oGcHC",
    "W4pcHMvT",
    "vCohW61NbG",
    "W55FqunK",
    "W4VcV2DOvCkyW7W",
    "k8khWOv8gG",
    "krnJCmks",
    "W5dcP8oKWQJcIW",
    "WRNdQWFcO2G",
    "AYJcHSkGba",
    "iMbVwCo8WR0",
    "h8kQWRis",
    "mCoFWPJdSCkIW6a",
    "WPFdJ8kX",
    "WRFdVwCzW44XWQCYxY4dW4VdV1FdSa9oaCkFW6b0pgRdHCoAC8oMW4S",
    "W5xcLIu",
    "W4BdNSkUzuu",
    "WP7cUSkon8oDW5tcICoJ",
    "W7NdU3m0amkpuSkIp8oTfatcKCkOWRDy",
    "f8k9WQisle0",
    "C2Xs",
    "AYZcHG",
    "aH48WR0tFG",
    "W4ZcKxCVW7u",
    "fW3cVmk1vNiQW6yLoJDYW6BcOSokkHFdINhcL8oZW7e",
    "W7WlWO3dQ0DD",
    "WQnrzryH",
    "W7egW6dcMh4",
    "WRlcJtBdHmoN",
    "WP3cTSoZzCotW5pcJ8o8WPhcTa",
    "hCkkWQn4oCkGW4nbW4ZcTSkM",
    "rWhdUSknhG",
    "W7tdP8oMBNdcN8kt",
    "W7iwegGv",
    "dZzkymkBWOtdPSoTW78",
    "rmkQvXtdQ38",
    "rZqNWRddGHKzWPxdOG",
    "ESoldCoo",
    "qWtdNCkChG",
    "W6ddTHpdKmo9",
    "gmkzr8o2ca",
    "WRxcSGtcOSoT",
    "W5SMWRtcRq",
    "W7SmW5dcLLeTlcRdHXNdOSkqeCk5",
    "WRBcGrpdOCofq04Pac/cVLL/ySkAyY3dM30VW7JdRKrWnINcNmonzcfnpSkgASkjtCkIeW",
    "ySkQufG",
    "WOTfvGu+",
    "W53dKhuvbq",
    "yZBcMmkPdXddMYyOWRRcLq",
    "tGXIjSoC",
    "g8kUs8oEhW",
    "n2zUvSoMWRJcTW",
    "W5RcUmkm",
    "W4BcMsNcGbldJW",
    "dSodW73cK8k7",
    "W6BcQw5fFG",
    "W5BcUmklWOhcLwtcLSoUuHjx",
    "D8oSe8kBpG",
    "kmoprfHWWRCuomo4mwHlpeXgW53dRmkiWOBdQcDJpgxdO8o0WP/dP8ovWQVdLg9iWOq",
    "v35tW6ZdNq",
    "rdyKWQ3dMq",
    "jdlcHSoHfdBdMcbVW7ZcIapcPMDBb8k8",
    "WP3dSqlcVKa",
    "B8onW58Lca",
    "dtfayCksWPO",
    "W5TzquKR",
    "uSowWPhdTcXe",
    "vCo6bCk9oG",
    "W63dH8oMzN0",
    "W5VcGfS7W5m",
    "WPFdJCk+WPpcTW",
    "WPrAtq",
    "gmkvWROwo0X+",
    "W4ddULqIcG",
    "W4WXWQNcUayo",
    "D8o9W6HJdq",
    "W58IWR7cQHC",
    "uCkSWO0SiW",
    "WQxcHaddU8oHtX1SxY7dP3z6BCkmCq",
    "dJD9CCkpWOtdPSoV",
    "yCk/WP47hq",
    "W7dcK8kSWOFcVa",
    "W6hdLSktiSos",
    "fmkWWRGunKbJW5e",
    "W5JcGYdcSYe",
    "D8oGWRNdQmobW45krGv6WPxcHe0NW5S0WP/dHCk0b8ootuHHuJVcPmksW4VdIxtdOCoxEr7dLKBcILBcVsFdLmopWPVdKCokWPlcIMTrWOldKCkFjXeiWRHNxSojW7tcRCk/WO3cQ2NcG8kQyHpcPbzxEfbIW4e",
    "W7dcJuflDa",
    "bbWtWQe9",
    "W43dUhe4jCkdt8kI",
    "dSkFWQDHmG",
    "B8olW4mLfmkZ",
    "wXZdLCo4WPRcGLzj",
    "yXVdJCkXcW",
    "sWddKCoGWR4",
    "W6pdS8kkvKVdL8kDruvc",
    "pmout0jM",
    "W4aijKe",
    "EdNcMmkOeJu",
    "smoGW6yfpCo3",
    "W5j9q247",
    "WOVdI8kBwrS",
    "WRFdNmkFWPtcRW",
    "WO/dPmkIsdZcLW",
    "W44ZWRZcTqS",
    "FJj3nSok",
    "wfHAW6pdKaf7",
    "W5PFq0i",
    "eCo0sM1g",
    "qMLdW7hdJaa",
    "twNcHHy",
    "W53dNdi",
    "W5BcHMvTq8kk",
    "xmolbmkg",
    "xrtdUmkSfx1+",
    "W7dcSG7cOq",
    "WPBcGaddQ8oh",
    "btP5WRJcMrftWPNcTW",
    "W4lcQh1BtG",
    "WPRcRGxcLCo9",
    "fbKSWQev",
    "W4ZdUxe",
    "W7/dQCktwLZdGmkgrK8",
    "kSoQEG",
    "yW8sWOhdGq",
    "WO3dNc7cT38dWRlcSSke",
    "umkJWRKigSk1r8oRWPJcLW",
    "o8o9BLLa",
    "WOVcISoZWOBcHW",
    "isBcS0O",
    "WPzCxqSWfX7cKbpdUSkVDJ/dLXFdJSk7",
    "WRv4WPBdOuuDWR4+",
    "t8oOWOVdTCoC",
    "W4NdOmo9xeO",
    "us8KWQe",
    "WPZdPGlcH1S",
    "hJDnCmkqWOJdPSo8",
    "FJFcPCk4dZhdKcG",
    "W7yPlfmr",
    "W73cVhm",
    "w8k7waFdQMq",
    "W4FcJwaCW5zRWQayyq",
    "F3m+W6ScWOaY",
    "WQxdOmoLhdW",
    "W7C+WRRdSwWrWPGdWP0bW4RdPCoSW6C",
    "FKzKyIG",
    "zJO0dmo3WPNcKCoxB8kI",
    "lb9Mq8kw",
    "jSkgWRe2dG",
    "WOv3nuim",
    "uJaTWQRdMq",
    "WORdMmkQWO4",
    "W78FW5FcJfe",
    "WQddP8k9WPVcLa",
    "W7/dUmkcr1VdImkbduzqW4pdRmk9",
    "WRlcN8o9WO7cHa",
    "kSk9WQmvaa",
    "ArBdV8kSnW",
    "W6NdHrddJCoN",
    "W5JdVmkMmSo0",
    "W7hcVHy",
    "W7Pezhqr",
    "W4ldNvdcS8kFfGTVqG/dKgq",
    "bmoTa1hdUL94W4rZpq",
    "nSowW5u1vSkMESkqW6zUWRe3W4FdLgiAW7lcQCoyWOahpSkba8oD",
    "qaiRWOddTW",
    "qXtdOmkUe2y",
    "W5ztvvi",
    "kSoTxLjX",
    "j8kqWRu6oG",
    "xapdQSoLWPW",
    "n8kdW4/dPde",
    "trJdOmkT",
    "WOdcVmoZ",
    "W4qMWRxcMH0pW4q",
    "W6BdSSkixq",
    "DCk/rqu",
    "W5GIWQxcRrSfW4y",
    "FCoDWORdHt4",
    "F8oxWPS",
    "W7NdQSkIc8o/",
    "DSo+W6HVia",
    "ywflEHm",
    "WOhdK8k2WP/cPW",
    "ESofpmkVmW",
    "mSopW5e",
    "AmodW58YhG",
    "zvXNCq",
    "grBcNwHRWPe",
    "W73cRmk7z1y6W7ddSSo3zLO",
    "fSoGW7dcLmkL",
    "W6iWaeWq",
    "h8oJwwT3",
    "W7pcOXBcOtRcMa",
    "W4ddUxyOmmkPrW",
    "sNNcMrXq",
    "A8ooW4GNdSk2Eq",
    "vCkIWRyj",
    "x8oEgCkffq",
    "B8kkWP8RaW",
    "WPZdSmkOWPBcSa",
    "W7xcMxOlW4a",
    "ztyJWPtdVq",
    "W57dQ8kRpSoWW5i",
    "gmkHWOvdmG",
    "W5NcQapcQXW",
    "wCoSWONdNmow",
    "kmkrWRWCcW",
    "WP/cQ8o+WQRcKLi",
    "vCkOWRKkhmkk",
    "D0O8W64",
    "cIPlCW",
    "W7VdTmkpv13dKa",
    "tXPgemo6",
    "lmkLW4ZdGqW",
    "WOdcHGxdP8optWb9va",
    "z0yIW6yAWOyL",
    "aSktFSoWd8oRvmo1",
    "W4RdGtldKSoLWR85zW",
    "tCkWCSoWh8oRvCo8",
    "W5qsi1GICW",
    "oCkiWPregG",
    "cSkbWRq",
    "zmoFW5vfawhdRe8",
    "qY1ie8ocW5JdUG",
    "W7mPWQZdSW",
    "WRhdLSo6zLNdImopW6mhWQK+W4ZdM1q",
    "imkyWQ9DgG",
    "tJvkkmoW",
    "m8kBWOmEqtNcU1SGimoSWQldLG",
    "rmoFWRFdPH4",
    "W6tcOLdcRmkRFb44oq",
    "vgr0FIy",
    "rdBdT8o/WPO",
    "b8kXW6a",
    "W4BcP1j9AG",
    "W7lcMxXKtG",
    "xmo4WOpdLCoH",
    "r8kYvXtdUgnaW6C",
    "DLe3W6SpWOa",
    "WQBcUSo2W7u",
    "WPFdPmo3kau",
    "W6/dP8k1mSo9W5pdU8kRW7pcSLfgnSkLWQTZdmoWj8kdyuyTfgNcQSowWRC1gL49eZ5jCgfd",
    "W7/dM8oVFx0",
    "qmotWOBdVmou",
    "imkWWRu8lq",
    "WP9Oo1uEW4W5W4NcJmk/W4NdNW",
    "lYhcUe9zW4SshW",
    "f8k7W6lcVa",
    "jSo7y19bWQW",
    "W4BdNSkRmmoOW5pcQq",
    "hZpcLwv8",
    "hqq5",
    "WQBdNmkHWP/dTCkK",
    "W5mhm0WKEeNdGZHcWPy",
    "nmovWOBdUSkW",
    "jMvKw8oMWRJcTW",
    "W7ZdVGJdGmo7",
    "W5BcILizW4W",
    "W5JdLmoOvwG",
    "m8owWOhdUCkQW6RdPq",
    "qbnub8op",
    "WQNcLmoNWQ7cHa",
    "W4pcQvTCBG",
    "nNPY",
    "kctcV1LFW44",
    "W6RdMmozE3VcK8kpW7q",
    "W7xcTaZcTYdcJMNdNu3cGWS",
    "rrHpiCoW",
    "WQpdSCoSobSI",
    "W43cGgPT",
    "uZTIh8oV",
    "uWNcPmkBbq",
    "qb/dPCkShMP0WQe3",
    "WQ/dPYfFWO8VWQOWtbm5W7m",
    "x2/cUqDKuSk4W7y",
    "wH/dQSkSawD1WRm9",
    "tSk8WQyNeG",
    "CxuOW4iA",
    "W58VWQ3cOa",
    "WR7dHCoieX8",
    "q3blvW",
    "W5BcT8khWOBcNG",
    "W7FcHMmOW4S",
    "dSovWPFdJCkV",
    "CSogW5PFgwhdSfu",
    "cCkgWRLSj8kNW69f",
    "WRpdM8k2WQdcTq",
    "uW4FWQVdOa",
    "cSkTC8o0eW",
    "uSoNWRRdNZO",
    "W47dSMympmksu8k/mSoQgsi",
    "qxPv",
    "WONcUmoBWR7cKa",
    "wW0aWQpdMq",
    "W57dGJddNSoQWRS0EmojWR57vq",
    "fJ9mC8k4",
    "W7tdVSkYjSo7",
    "mmkKWQusDb0",
    "zve3W7WEWOS0W6RdNdJcGq3dNKq",
    "WPtdKCkZWOpcOCoXbc9BqmkUmq",
    "W7GlW5FcK0aX",
    "kmkCW4ddRdeQW5pdGq",
    "W594AvbiW5fVW57dR8kIWO8",
    "gmoyW7/cPMvPWPtcKcTEWR8MBKeViCksqCoYWO3dKq7dRbtdGCkkWOhcVdhdJWbYWR7cQa",
    "kCkiWRnHpG",
    "WQHJWQJdSh5rWOqYWPKjW5/dUCoUW7tdLmkeWQ7cGcOwkxRcOCkNWPBdV8oWWOy",
    "6lwR5RUJ6kwL5PYC5AEz6lEo77Y5",
    "W4m1nwaz",
    "ruzKW4ZdKa",
    "qg0aW4qT",
    "imkCW4ddUcGMW5ldMW",
    "qxHAW6VdNq",
    "aH8/WROsFW",
    "WP7dJSo3jJy",
    "WPFcOCoZWRJcI1/cTCki",
    "WPNcNSo8WQZcN1/cQq",
    "W4ZcRSk7wd/dKw5fhdzEWPukWPHZm8kRWQJdV8kaW4VdSG3cMhLSb2G",
    "whdcHHPI",
    "W6VcOhm",
    "dtlcPxzh",
    "imowWP3dVCkO",
    "vNpcQSoNxxlcLNb1WONcGepcUWSumSkBW4xcJ0inWPywW5rpcsXVfSk7qH/cGca",
    "amkAWQnOoCkgW7bjW4FcQ8k3",
    "sSk/WRq",
    "aSoZWOhcI8oQW5PwCW",
    "fau9",
    "W7VcVNKnW5i",
    "dSkdWRbI",
    "hSodw8kkrhPLFwGREa",
    "xMfkwX4",
    "jmkvWPe0ma"
]
// 用于保存函数源码
function i11lill(_0x3d734c, _0x5d5d74) {
        var _0x5d2d0f = bigarry;
        return i11lill = function(_0x5337e6, _0x523082) {
            _0x5337e6 = _0x5337e6 - 0x83;
            var _0x5c486d = _0x5d2d0f[_0x5337e6];
            if (i11lill['uuAPky'] === undefined) {
                var _0xad76ec = function(_0x2001a6) {
                    var _0x4a790 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                    var _0x2cbf96 = ''
                      , _0x3e5254 = '';
                    for (var _0x494c32 = 0x0, _0x385b74, _0x1c00ac, _0x1d7487 = 0x0; _0x1c00ac = _0x2001a6['charAt'](_0x1d7487++); ~_0x1c00ac && (_0x385b74 = _0x494c32 % 0x4 ? _0x385b74 * 0x40 + _0x1c00ac : _0x1c00ac,
                    _0x494c32++ % 0x4) ? _0x2cbf96 += String['fromCharCode'](0xff & _0x385b74 >> (-0x2 * _0x494c32 & 0x6)) : 0x0) {
                        _0x1c00ac = _0x4a790['indexOf'](_0x1c00ac);
                    }
                    for (var _0x5e1f77 = 0x0, _0x3091ee = _0x2cbf96['length']; _0x5e1f77 < _0x3091ee; _0x5e1f77++) {
                        _0x3e5254 += '%' + ('00' + _0x2cbf96['charCodeAt'](_0x5e1f77)['toString'](0x10))['slice'](-0x2);
                    }
                    return decodeURIComponent(_0x3e5254);
                };
                var _0x34efac = function(_0xbd4cc6, _0x4d1371) {
                    var _0x4a66a8 = [], _0x388f12 = 0x0, _0x3ee16e, _0x1a3906 = '';
                    _0xbd4cc6 = _0xad76ec(_0xbd4cc6);
                    var _0x3bea17;
                    for (_0x3bea17 = 0x0; _0x3bea17 < 0x100; _0x3bea17++) {
                        _0x4a66a8[_0x3bea17] = _0x3bea17;
                    }
                    for (_0x3bea17 = 0x0; _0x3bea17 < 0x100; _0x3bea17++) {
                        _0x388f12 = (_0x388f12 + _0x4a66a8[_0x3bea17] + _0x4d1371['charCodeAt'](_0x3bea17 % _0x4d1371['length'])) % 0x100,
                        _0x3ee16e = _0x4a66a8[_0x3bea17],
                        _0x4a66a8[_0x3bea17] = _0x4a66a8[_0x388f12],
                        _0x4a66a8[_0x388f12] = _0x3ee16e;
                    }
                    _0x3bea17 = 0x0,
                    _0x388f12 = 0x0;
                    for (var _0x184498 = 0x0; _0x184498 < _0xbd4cc6['length']; _0x184498++) {
                        _0x3bea17 = (_0x3bea17 + 0x1) % 0x100,
                        _0x388f12 = (_0x388f12 + _0x4a66a8[_0x3bea17]) % 0x100,
                        _0x3ee16e = _0x4a66a8[_0x3bea17],
                        _0x4a66a8[_0x3bea17] = _0x4a66a8[_0x388f12],
                        _0x4a66a8[_0x388f12] = _0x3ee16e,
                        _0x1a3906 += String['fromCharCode'](_0xbd4cc6['charCodeAt'](_0x184498) ^ _0x4a66a8[(_0x4a66a8[_0x3bea17] + _0x4a66a8[_0x388f12]) % 0x100]);
                    }
                    return _0x1a3906;
                };
                i11lill['sFFZlX'] = _0x34efac,
                _0x3d734c = arguments,
                i11lill['uuAPky'] = !![];
            }
            var _0x413894 = _0x5d2d0f[0x0]
              , _0x3305b4 = _0x5337e6 + _0x413894
              , _0x324f4b = _0x3d734c[_0x3305b4];
            return !_0x324f4b ? (i11lill['EylZsQ'] === undefined && (i11lill['EylZsQ'] = !![]),
            _0x5c486d = i11lill['sFFZlX'](_0x5c486d, _0x523082),
            _0x3d734c[_0x3305b4] = _0x5c486d) : _0x5c486d = _0x324f4b,
            _0x5c486d;
        }
        ,
        i11lill(_0x3d734c, _0x5d5d74);
    }



// 1. 预置根目标
const aliasMap = new Map([['i11lill', true]]);

// 2. 统一的别名解析函数（递归+记忆）
function resolveAlias(name, scope) {
  if (aliasMap.has(name)) return aliasMap.get(name);

  // 变量声明
  const binding = scope.getBinding(name);
  if (binding) {
    const path = binding.path;

    // const x = y
    if (path.isVariableDeclarator() && types.isIdentifier(path.node.init)) {
      const result = resolveAlias(path.node.init.name, path.scope);
      aliasMap.set(name, result);
      return result;
    }

    // 函数参数：function f(p) { ... }
    if (path.isFunction()) {
      // 函数参数本身不可能是别名，除非内部再赋值
      aliasMap.set(name, false);
      return false;
    }
  }

  // 全局作用域下未声明就使用的变量（如 c = xxx）
  // 这里简单返回 false，也可按需求扩展
  aliasMap.set(name, false);
  return false;
}

// 3. 第一次遍历：收集别名
traverse(ast, {
  // 3-a) 变量声明
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (types.isIdentifier(init)) {
      resolveAlias(id.name, path.scope);
    }
  },

  // 3-b) 赋值表达式
  AssignmentExpression(path) {
    if (path.node.operator !== '=') return;   // 只关心普通 =

    const left = path.node.left;
    const right = path.node.right;

    if (!types.isIdentifier(left)) return;        // 左侧不是简单标识符
    if (!types.isIdentifier(right)) return;       // 右侧也不是简单标识符

    // 右侧指向谁？
    const rightPointsTo = resolveAlias(right.name, path.scope);
    aliasMap.set(left.name, rightPointsTo);
  }
});

// 4. 第二次遍历：处理所有函数调用
traverse(ast, {
  CallExpression(path) {
    const { callee } = path.node;
    if (!types.isIdentifier(callee)) return;

    const pointsTo = resolveAlias(callee.name, path.scope);
    if (pointsTo) {
      // console.log(`Found call: ${path.toString()}`);
      processFunctionCall(path);
    }
  }
});
console.log(aliasMap);  // 调试输出



// 3. 遍历并替换异或表达式
traverse(ast, {
  BinaryExpression(path) {
    const { node } = path;
    if (
      node.operator === '^' &&
      node.left.type === 'NumericLiteral' &&
      node.right.type === 'NumericLiteral'
    ) {
      const result = node.left.value ^ node.right.value;
      path.replaceWith({
        type: 'NumericLiteral',
        value: result
      });
    }
  }
});
// 评估AST节点获取其值
function evaluateNode(node, scope) {
    switch (node.type) {
        case 'StringLiteral':
            return node.value;
        case 'NumericLiteral':
            return node.value;
        case 'BooleanLiteral':
            return node.value;
        case 'Identifier':
            // 尝试从作用域中获取变量值
            const binding = scope.getBinding(node.name);
            if (binding && binding.constant && binding.path.node.init) {
                return evaluateNode(binding.path.node.init, scope);
            }
            return undefined;
        case 'BinaryExpression':
            // 处理二进制表达式，如 0x90b99 ^ 0x90f36
            const left = evaluateNode(node.left, scope);
            const right = evaluateNode(node.right, scope);
            if (left === undefined || right === undefined) {
                return undefined;
            }
            switch (node.operator) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '*':
                    return left * right;
                case '/':
                    return left / right;
                case '%':
                    return left % right;
                case '|':
                    return left | right;
                case '&':
                    return left & right;
                case '^':
                    return left ^ right;  // 异或运算
                case '<<':
                    return left << right;
                case '>>':
                    return left >> right;
                case '>>>':
                    return left >>> right;
                default:
                    return undefined;
            }
        default:
            return undefined;
    }
}
function processFunctionCall(path) {
  const { node, scope } = path;
  let { arguments } = node;

  // 确保参数数量在1-2个之间
  if (arguments.length < 1 || arguments.length > 2) {
    return;
  }

  // 计算第一个参数的值
  const firstArgValue = evaluateNode(arguments[0], scope);

  // 如果无法确定第一个参数值，跳过
  if (firstArgValue === undefined) {
    return;
  }

  let secondArgValue = null;
  if (arguments.length === 2) {
    secondArgValue = evaluateNode(arguments[1], scope);
    // 如果第二个参数存在但无法确定值，跳过
    if (secondArgValue === undefined) {
      return;
    }
  }

  // 调用解密函数
  const decryptedValue = i11lill(firstArgValue, secondArgValue);

  // 用解密后的值替换函数调用
  path.replaceWith({
    type: 'StringLiteral',
    value: decryptedValue
  });
}




// 还原字符串编码
traverse(ast, {
    "StringLiteral": function (path) {
        if (path.node.extra && !path.node.extra.raw.includes(path.node.value)) {
            // delete path.node.extra.raw
            path.node.extra.raw = "'" + path.node.value + "'"
            // path.node.extra = void 0
        }
    }
})

//* ===== 1. 收集所有 “对象字面量” 定义的变量 ===== */
const objMap = new Map();          // binding -> { key: AST_Node }

const collectVisitor = {
  VariableDeclarator(path) {
    if (types.isObjectExpression(path.node.init)) {
      collect(path.node.id, path.node.init, path.scope);
    }
  },
  AssignmentExpression(path) {
    if (path.node.operator === '=' && types.isObjectExpression(path.node.right)) {
      collect(path.node.left, path.node.right, path.scope);
    }
  }
};

function collect(left, initObj, scope) {
  const binding = scope.getBinding(left.name);
  if (!binding) return;
  const table = Object.create(null);
  initObj.properties.forEach(prop => {
    const key = types.isStringLiteral(prop.key) ? prop.key.value : prop.key.name;
    table[key] = prop.value;          // 保存 AST 节点
  });
  objMap.set(binding, table);
}

/* ===== 2. 还原 MemberExpression 调用 ===== */
const restoreVisitor = {
  MemberExpression(path) {
    const { node } = path;
    if (!types.isIdentifier(node.object) || !types.isStringLiteral(node.property)) return;

    const binding = path.scope.getBinding(node.object.name);
    const table = objMap.get(binding);
    if (!table) return;

    const astVal = table[node.property.value];
    if (!astVal) return;

    // 如果是函数调用，直接把函数节点换上去
    if (types.isCallExpression(path.parent) && path.parent.callee === node) {
      path.replaceWith(astVal);
    } else {
      // 否则把成员表达式替换成字面量/函数
      path.replaceWith(astVal);
    }
  }
};

/* ===== 3. 执行收集 + 还原 ===== */
traverse(ast, collectVisitor);
traverse(ast, restoreVisitor);

traverse(ast, {
  WhileStatement(path) {
    const prev = path.getPrevSibling();
    if (!prev || !types.isVariableDeclaration(prev)) return;

    /* ---------- 1. 取出顺序数组 ---------- */
    const declarator = prev.node.declarations[0];
    const order = evaluate(declarator.init);   // ["0","1","2","3","4"]
    if (!Array.isArray(order)) return;

    /* ---------- 2. 收集 case ---------- */
    const caseMap = Object.create(null);   // 键值对： { '0': [stmt,stmt], '1': [stmt,stmt] }
    path.node.body.body[0].cases.forEach(cs => {
      if (!types.isStringLiteral(cs.test)) return; // 只处理常量 case
      const key = cs.test.value;

      /* 去掉末尾的 continue; 它只在 switch 里有意义 */
      const body = cs.consequent.filter(st => !types.isContinueStatement(st));
      caseMap[key] = body;          // AST 节点数组
    });

    /* ---------- 3. 按顺序生成新语句 ---------- */
    const newStmts = [];
    order.forEach(k => {
      if (caseMap[k]) newStmts.push(...caseMap[k]);
    });

    /* ---------- 4. 替换：删掉变量声明 + while，换成顺序语句 ---------- */
    prev.remove();
    path.replaceWithMultiple(newStmts);

    /* ---------- 5. （可选）打印调试 ---------- */
    console.log('case 键值对:', caseMap);
    console.log('还原后语句数量:', newStmts.length);
  }
});


/* ---------- 轻量级静态求值 ---------- */
function evaluate(node) {
  if (types.isStringLiteral(node)) return node.value;
  if (types.isNumericLiteral(node)) return node.value;

  // "0|1|2|3|4"["split"]('|')
  if (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isLiteral(node.callee.object) &&
    node.callee.property.value === 'split' &&
    types.isLiteral(node.arguments[0])
  ) {
      console.log('1111111')
    return node.callee.object.value.split(node.arguments[0].value);
  }

  // 0x0
  if (types.isUnaryExpression(node, { operator: '-' }) &&
      types.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }

  return '<无法求值>';
}


// 8. 删除未使用的变量
const referencedIdentifiers = new Set();
traverse(ast, {
  Identifier(path) {
    if (
      !path.parentPath.isVariableDeclarator() && // 排除声明语句
      !path.parentPath.isFunctionDeclaration()
    ) {
      referencedIdentifiers.add(path.node.name);
    }
  },
});

traverse(ast, {
  VariableDeclarator(path) {
    if (
      !referencedIdentifiers.has(path.node.id.name)
    ) {
      path.remove(); // 删除未使用的变量
    }
  },
});


// traverse(ast, {
//     VariableDeclaration(path) {
//         if (path.node.declarations.length === 0) {
//             path.remove();
//         }
//     }
// });



// 二次加餐 还原 debu + gger  1 +2

let output = generate(ast).code

fs.writeFileSync("output/jsjiami.js", output)