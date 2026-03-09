import hashlib
import json


import execjs
import requests
import time

session = requests.Session()

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

def get_token():
    timestr = str(int(time.time())*1000)

    d = {
        "cert_id": "225",
        "nonce": "vyoho2kcnvxxf4",
        "password": "134153",
        "platform": "1",
        "seller_id": "16f36910df490122",
        "timestamp": timestr,
        "token": "",
        "username": "13014989931",
        "version": "1.1.30",
    }

    params_str = '&'.join(f'{k}={d[k]}' for k in sorted(d))
    params_str = params_str + '&key=cd15cef931459789e502c0731c6b471a'
    sign = hashlib.md5(params_str.encode()).hexdigest()
    d['sign'] = sign

    data = ctx.call('get_data', d)

    response = session.post('https://api-next.dingkao.cn/v2/member/login', headers=headers, data=data)

    res = ctx.call('get_result',response.text,data['key'])

    code = res.get('code')
    if code == 0:

        token = res.get('data').get('token')

        return token
# 'cert_id=225&nonce=vyoho2kcnvxxf4&password=dk13025903926&platform=1&seller_id=16f36910df490122&timestamp=1762669690000&token=&username=dk13025903926&version=1.1.30&key=cd15cef931459789e502c0731c6b471a'
