import random
import time

import requests
import execjs

ctx = execjs.compile(open('js/token.js','r',encoding='utf-8').read())
ctx2 = execjs.compile(open('js/jiami.js','r',encoding='utf-8').read())

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://www.teld.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://www.teld.cn/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}


def get_AccessToken():
    params = {
        'SID': 'UserAPI-WEBUI-ASRefreshToken',
        'r': random.random(),
    }
    param = '{"DeviceType":"WEB","ReqSource":100,"RefreshToken":"A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDM0NzY4MC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.efGz7Oo7egLW4JK4LJnksnxjcPDnbslBZJn8yFAOp5A","ClientIP":"27.20.111.203"}'

    refreshToken = ctx.call('get_params', param)
    timeit = str(int(time.time()))
    WVER = ctx2.call('generateWVER', timeit)
    data = {
        'refreshToken': f'{refreshToken}',
        'X-Token': '',
        'WTS': timeit,
        'WVER': WVER,
        'WSDI': '27.20.111.203',
        'WRS': 'WEB',
        'WCOI': '',
        'WCOL': '',
        'ClientTime': '2025-07-18 09:07:13',
        'DiffentTime': '0',
        'ClientIdentification': '',
    }

    response = requests.post('https://sgi.teld.cn/api/invoke', params=params, headers=headers, data=data)
    # print(response.text)

    datas = ctx.call('get_token', response.json())
    AccessToken = datas['AccessToken']
    return AccessToken

