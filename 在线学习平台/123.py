import hashlib
import json

import execjs
import requests
import time


ctx = execjs.compile(open('js/crytoencrypt.js','r',encoding='utf-8').read())
headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Origin': 'https://gxdzcs.dingkao.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://gxdzcs.dingkao.cn/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}

d = {
    "cert_id": "225",
    "nonce": "xafjg8kntumjxt",
    "platform": "1",
    "seller_id": "16f36910df490122",
    "timestamp": int(time.time() * 1000) // 1000 * 1000,
    "token": "",
    "type": "2",
    "version": "1.1.30",
}
params_str = '&'.join(f'{k}={d[k]}' for k in sorted(d))
params_str = params_str + '&key=cd15cef931459789e502c0731c6b471a'
sign = hashlib.md5(params_str.encode()).hexdigest()
print(sign)
d['sign'] = sign

data = ctx.call('get_data', d)
print(data)
response = requests.post('https://api-next.dingkao.cn/v2/site/cates', headers=headers, data=data)
print(response.text)
res = ctx.call('get_result',response.text,data['key'])

print(res)