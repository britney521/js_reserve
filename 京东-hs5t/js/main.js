const CryptoJS = require('crypto-js');

try{
    require('./js/env.js');
require('./js/hs5t.js');
}catch {
    require('./env.js');
require('./hs5t.js');
}



window.PSign = new window.ParamsSign({
    appId: 'f06cc',
    preRequest: false,
    onSign: (res) => {
        // 签名可用率监控，业务方自行上报
        if (res.code != 0) {
            try {
                window.dra &&
                window.dra.sendCustomEvent &&
                window.dra.sendCustomEvent({
                    name: 'main_search',
                    metrics: {
                        error_code: '751',
                        error_type_txt: '接口加密失败onSign非0',
                    },
                    context: {
                        error_code: res.code,
                    },
                })
            } catch (error) {
                console.log(error)
            }
        }
    },
    onRequestTokenRemotely: (res) => {
        // 算法接口可用率监控，业务方自行上报
        if (res.code != 200) {
            try {
                window.dra &&
                window.dra.sendCustomEvent &&
                window.dra.sendCustomEvent({
                    name: 'main_search',
                    metrics: {
                        error_code: '751',
                        error_type_txt: '接口加密失败onRequestTokenRemotely',
                    },
                    context: {
                        error_msg: res && res.message ? res.message : '接口加密失败',
                    },
                })
            } catch (error) {
                console.log(error)
            }
        }
    },
});
window.SHA256 = function (s) {
    return CryptoJS.SHA256(s).toString();
};

function get_hs5t(params, time) {

    const paramsH5sign = {

        appid: 'search-pc-java',
        functionId: 'pc_search_searchWare',
        client: 'pc',
        clientVersion: '1.0.0',
        t: time,
    }
    if (params) {
        paramsH5sign['body'] = window.SHA256(JSON.stringify(params))
    }

    const {h5st} = window.PSign._$sdnmd(paramsH5sign)
    console.log(h5st,'h5sth5st')
    console.log(h5st.length)
    return h5st
}

//
// const params = {
//     "enc": "utf-8",
//     "pvid": "f486f9d3b17746acb4b38311166715a0",
//     "area": "17_1413_1419_7573",
//     "page": 1,
//     "mode": null,
//     "concise": false,
//     "new_interval": true,
//     "s": 1
// }
// const time = new Date().getTime()
//
// get_hs5t(params, time)
// crypto_signature 由_$Vj.prototype._$clt生成
// 1128
// [timestamp];[fingerprint];[appId];[token];[crypto_signature];[version]
// 20260129130016920;mmwm63igzq6pqdd0;fb5df;tk03wab681bcc18neEIlrt2csdWdd32h3W5ikEe-c9ibv4-Oloz4yzJSOuyB35vr6Kih3l1q34E3s68x6xWApaPTrO0H;b7d68835e105319bfe3211ba60aa8de6927d5788596ed70358ef6b3ab0a68367;5.2;1769662813920;gt6f-heI9caFrd6D68rVrtrE0s7ZB5_ZxI7ZBh-f1ZOVB5_ZzUrJ-hfZXx-ZpRLI9YbT_IOJxhOT-IbT8EuU8AuUrNeV-Y_UsZuUoZ_ZB5_ZxIdG6YLIqYfZB5hW-Z_U7UbUsNuJwROUrVbVwFOV7YLIxhuJu9uVoRbVvVOV-h-T-VKJroLJ_YfZB5hW-dOW-h-T-ROE-YfZB5hW-9_WvpPUrkMI187ICMeH-h-T-J6ZBh-f1ZvVwsfUttPPNA8VNU7L-h-T-trG9oLJvYfZB5hW-xLItoLP_cLO-h-T-JbF-hfZXxPCBh-f-p7Q-h-T-VOVsY7ZBhfZB5hWvh-T-dOVsY7ZBhfZB5hWtdeZnZfVwN6J-hfZBh-f1BOWB5_ZvdOE-YfZBhfZXx-ZVIrMpZsVrYOPtI7ZB5_Z0kbIzc7F-hfZBh-f1heZnZfTsY7ZBhfZB5hWxh-T-FOE-YfZBhfZXxfVvh-T-JOE-YfZBhfZXxfVB5_ZsN6J-hfZBh-f1heZnZfUsY7ZBhfZB5hWqFeZnZvVsY7ZBhfZB5hW-J_WwpfV-h-T-dOE-YfZBhfZXxfVB5_Z2E6ZBhfZB5hWsh-T-VaG-hfZBh-f1heZnZfG-hfZBh-f1heZnZfIqYfZBhfZX1aZnZfIzMbEpM7ZBh-f1taZB5BZRQaEAgKOd4MPrY8JCQ7H-h-T-ZeF-hfZBh-fmg-T-haF-hfZXx-ZqlMUwlcVwhfLBVsOBVLJUgfG8Q6GYgvT5UqGtoLH_cLO-h-T-dLEuYfZB5xD;4427accdf7bff02a3623a6dffab8e4905a49116b18d312eecb9e1ad1934a3f53;gRaW989Gy8bE_oLE7w-Gy8rFvM7MtoLI4wrJ1R6G88bG_wPD9k7J1RLHxgKJ


