import json
import time

import pandas as pd
import requests
import execjs

from 充电站.des import get_data
from 充电站.token import get_AccessToken

ctx = execjs.compile(open('js/jiami.js','r',encoding='utf-8').read())
ctx2 = execjs.compile(open('js/jiemiall.js','r',encoding='utf-8').read())


cookies = {
    'teld_locale': 'zh-CN',
    'UM_distinctid': '19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81',
    'Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752676439',
    'HMACCOUNT': '6D83D73E37231F0E',
    'teldz': '27.20.111.203',
    '__jsluid_s': '9b9a89bbce6957611303b25b099801bc',
    'Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752717134',
    # 'teldk': 'A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJyZWZyZXNodG9rZW5faWQiOiJiMzQxNzNkODM2ZTg0NTEwYjRhN2ZjOTAwMjVhZjVjNCIsInZhbGlkYXRlX3R5cGUiOjEsInNjb3BlIjoiKiIsInNvdXJjZSI6IkEiLCJjbGllbnRfaXAiOiIyNy4yMC4xMTEuMjAzIiwiZXhwIjoxNzUyODEyODgwLjAsImNyZWF0ZV9mcm9tIjoic2V0IiwicmRzX2ZsYWciOjEsImRhdGEiOm51bGx9.LdpEbEKEyvq2fo_OWNi_5sb7rqq1EWgFztZuqplT0ng',
}
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    # 'Cookie': 'teld_locale=zh-CN; UM_distinctid=19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81; Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d=1752676439; HMACCOUNT=6D83D73E37231F0E; __jsluid_s=9b9a89bbce6957611303b25b099801bc; teldb=TLU6dgdJkQivkqSydn2MJQny37BL3JrDO4ILEzzMlA0.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiOGY1YzYwMDRmZGUzNDY5ZmI1NDM5ZmEyOWE5ZWUxNWMiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDI5ODMzMC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9; teldc=1; teldz=27.20.111.203; ASP.NET_SessionId=mdt3gsdakxsdz5xecc2qq3n1; teldk=A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiIiLCJzZXNzaW9uX2lkIjoiIiwidG9rZW5faWQiOiIwNzllYTgxNTk0ODg0MDY5YTMzM2VkYTYzMmEzYWNmZiIsInJlZnJlc2h0b2tlbl9pZCI6IjhmNWM2MDA0ZmRlMzQ2OWZiNTQzOWZhMjlhOWVlMTVjIiwidmFsaWRhdGVfdHlwZSI6MSwic2NvcGUiOiIqIiwic291cmNlIjoiQSIsImNsaWVudF9pcCI6IjI3LjIwLjExMS4yMDMiLCJleHAiOjE3NTI3NjUxNzkuMCwiY3JlYXRlX2Zyb20iOiJzZXQiLCJyZHNfZmxhZyI6MSwiZGF0YSI6bnVsbH0.FsP3eo-W5-M-Rh-tHf8_FX78T1GPOx1SR-sYC5-Vuao; Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d=1752764150',
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
teldk = get_AccessToken()
cookies['teldk'] = teldk
params = {
    'SID': 'BaseApi-WebSite_MapStaListALL',
}

param_data = ctx.call('get_params')
timeit  = str(int(time.time()))
WVER = ctx.call('generateWVER',timeit)
data = {
    'TELDAppID': '',
    'param': '{"Data":"RoIx8W4PnH+mg2x9W8dEyY6gYkLeO5xYhpgux7S7sKNpMIIo2Xv4elSi+E1J765d","UTS":"1753058858","UVER":"y3mhVqKWHOureKgT","UUID":"17530588581502974992292"}',
    'X-Token': cookies['teldk'],
    'WTS': timeit,
    'WVER': WVER,
    'WSDI': '27.20.111.203',
    'WRS': 'WEB',
    'WCOI': '',
    'WCOL': '',
    'ClientTime': '2025-07-21 08:41:18',
    'DiffentTime': '0',
    'ClientIdentification': '',
    'sendTime': '2025-07-21 08:41:18',
}

response = requests.post('https://sgi.teld.cn/api/invoke', params=params, cookies=cookies, headers=headers, data=data)

data_list = []

datas = ctx2.call('get_all_data',response.json())

for item in json.loads(datas):

    time.sleep(2)
    a = item['a']
    b = item['b']
    e = item['e']
    print(a,b)
    data = get_data(b,e)

    print(data)

    data_list.append(data)

df = pd.DataFrame(data_list)

df.to_csv('output.csv', index=False)