import requests
import execjs
import time
from pprint import pprint
from 充电站.token import get_AccessToken

ctx = execjs.compile(open('js/jiami.js','r',encoding='utf-8').read())
ctx2 = execjs.compile(open('js/jiemi.js','r',encoding='utf-8').read())


cookies = {
    'teld_locale': 'zh-CN',
    'UM_distinctid': '19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81',
    'Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752676439',
    'HMACCOUNT': '6D83D73E37231F0E',
    'teldz': '27.20.111.203',
    '__jsluid_s': '9b9a89bbce6957611303b25b099801bc',
    'Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752717134',
    # 'teldk': 'A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiIiLCJzZXNzaW9uX2lkIjoiIiwidG9rZW5faWQiOiIyM2UyODQzMjdjZjA0MDI2ODdlYjU3ZDZjYzA5NjQ0MiIsInJlZnJlc2h0b2tlbl9pZCI6IjhmNWM2MDA0ZmRlMzQ2OWZiNTQzOWZhMjlhOWVlMTVjIiwidmFsaWRhdGVfdHlwZSI6MSwic2NvcGUiOiIqIiwic291cmNlIjoiQSIsImNsaWVudF9pcCI6IjI3LjIwLjExMS4yMDMiLCJleHAiOjE3NTI4MDIwMzMuMCwiY3JlYXRlX2Zyb20iOiJzZXQiLCJyZHNfZmxhZyI6MSwiZGF0YSI6bnVsbH0.s7W1G-jqCbTA0OEjngXc9UqMBHoCjQSGNkRw4RzBHnI',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    # 'Cookie': 'teld_locale=zh-CN; UM_distinctid=19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81; Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d=1752676439; HMACCOUNT=6D83D73E37231F0E; teldz=27.20.111.203; __jsluid_s=9b9a89bbce6957611303b25b099801bc; Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d=1752717134; teldk=A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiZWFkMzM0ODdjZjQ4NDgyNWEyYTA3YzM1YjI0YWMzMzkiLCJyZWZyZXNodG9rZW5faWQiOiJlYWQzMzQ4N2NmNDg0ODI1YTJhMDdjMzViMjRhYzMzOSIsInZhbGlkYXRlX3R5cGUiOjEsInNjb3BlIjoiKiIsInNvdXJjZSI6IkEiLCJjbGllbnRfaXAiOiIyNy4yMC4xMTEuMjAzIiwiZXhwIjoxNzUyNzIwOTg5LjAsImNyZWF0ZV9mcm9tIjoic2V0IiwicmRzX2ZsYWciOjEsImRhdGEiOm51bGx9.YUzdlq7kOh6Lmz8lzznzxVn3JgsdHmP3pVNV_XJXFL0',
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

def get_data(id,e):
    params = {
        'SID': 'BaseApi-WebSite_MapStaInfoByID',
    }
    teldk = get_AccessToken()
    cookies['teldk'] = teldk
    # 充电桩id
    info = {"id":id,"stationType":e}
    timeit  = str(int(time.time()))
    WVER = ctx.call('generateWVER',timeit)
    # 获取参数
    param = ctx.call('b_cajess',info)
    data = {
        'TELDAppID': '',
        'param': f'{param}',
        'X-Token': cookies['teldk'],
        'WTS': timeit,
        'WVER': WVER,
        'WSDI': '27.20.111.203',
        'WRS': 'WEB',
        'WCOI': '',
        'WCOL': '',
        'ClientTime': '2025-07-17 10:36:30',
        'DiffentTime': '0',
        'ClientIdentification': '',
        'sendTime': '2025-07-17 10:36:30',
    }

    response = requests.post('https://sgi.teld.cn/api/invoke', params=params, cookies=cookies, headers=headers, data=data)
    res_data = response.json()
    result = ctx2.call('get_real_data',res_data)
    # pprint(result,indent=2)
    return result



