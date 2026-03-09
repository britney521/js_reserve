import requests

cookies = {
    'captcha_v4_user': '57c1fbc2dd1847038018d866a1920519',
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    # 'Accept-Encoding': 'gzip, deflate, br, zstd',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Dest': 'script',
    'Referer': 'https://www.tianyancha.com/',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    # 'Cookie': 'captcha_v4_user=57c1fbc2dd1847038018d866a1920519',
}

params = {
    'callback': 'geetest_1764827282078',
    'captcha_id': 'af29b3003fc94f2ba29e865b31ee86ee',
    'client_type': 'web',
    'lot_number': 'd5a0c62ad02043f69dd8ec7d972be4a5',
    'pt': '1',
    'lang': 'zho',
    'payload': 'AgFD8gWUUuHFx-XvpP7J2R2uVGVD1oh5yrAcq-UUVmnxVU6SAkvox6ZGLKWspx9SdlbjMVXA5Ckpv-N7FbrfCozLuDEMsqmDKvt9Kx5qOJpZmJAvNjpzuISzcKfj8mnlSF0r-CjGqoSPX618nFmICy_u_0crjPCrSowmll8RUOr1dsD0O41E0dLOacufyJ2WXua840gN8y-gzKkzdpDok0Er1735QMWRTvRE9ZYlkXlkdxNpU72j5nprbvLMiZ56a4H_dGZF7DoNFf5eLkJ9bZ8Wal7qsu6Vhz1Ji9IvF4UD4NERMG1gQubl0PJf0ivaQ4SEZz3ZUBrTPKCpHIRBdjhQj-fcebh3JVRkJA7D6vNSc6xxWIvSI9alrm1cLQkzfKr41ZtbOePqm1x1VB6l19JsQTlOmFV_USvkf5TkDvX2Rivi3J6yGUH-2mu3hT5Ogtjp7jkrS40k5E9Hw1sLw3FB-DqwiE5COTj0BjrhobgmUwnxkELI1__0wN3TwKL3FicNb-DFSVEAKjlpd0RNOpIrA02YVuCNE65KYh1luAjY0z76WfTiUyf-kv6hl-ke2yg2NK9ScPjAubVLMqvalHfgubWLY8NzclSn9LW_BLIx9qZP6jkZETDw2qqVtO5RitPeTtaEgX0OS4GkFXjriqgXuHwIsrW8rRRfPJzrNPP-PBvnwASwOZj7XE73y1TYVhC_jPxjZVVhN90I6gNS47HtPmnGPiYtFyzrv5OmcB9V5rpK5fSDZygpxDr_8GQ09yVdFHq7dkMx6cNDisRKdheCwwhKokBEeqIET5WM90mVPtB9viBRLUgRdVayg5Xad2_J9rOy0P2azIEKGBWqXeQmoYo6Y1ycrSIoF8VdXkroEIw1MFCXHHVZQYEzfjoj47tFnBHw--RztFauklmPlsJqRbh2-B2JIEaQUC6XdJfBNQhG9-VdABQY3P69QiVj',
    'process_token': '835485fde8a872edf370a7393ae65ab7cd4b9da7d8c6773cec1dce586400f092',
    'payload_protocol': '1',
}

response = requests.get('https://gcaptcha4.geetest.com/load', params=params, cookies=cookies, headers=headers)
print(response.text)