import requests

cookies = {
    'teld_locale': 'zh-CN',
    'UM_distinctid': '19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81',
    'Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752676439',
    'HMACCOUNT': '6D83D73E37231F0E',
    '__jsluid_s': '9b9a89bbce6957611303b25b099801bc',
    'ASP.NET_SessionId': 'mdt3gsdakxsdz5xecc2qq3n1',
    'teldb': 'efGz7Oo7egLW4JK4LJnksnxjcPDnbslBZJn8yFAOp5A.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDM0NzY4MC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
    'teldc': '1',
    'teldz': '27.20.111.203',
    'teldk': 'A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiIiLCJzZXNzaW9uX2lkIjoiIiwidG9rZW5faWQiOiI5MTllZGNkMDQzMzk0ZDdmOWFlYjhlNjMyYTA1MDc2NSIsInJlZnJlc2h0b2tlbl9pZCI6ImIzNDE3M2Q4MzZlODQ1MTBiNGE3ZmM5MDAyNWFmNWM0IiwidmFsaWRhdGVfdHlwZSI6MSwic2NvcGUiOiIqIiwic291cmNlIjoiQSIsImNsaWVudF9pcCI6IjI3LjIwLjExMS4yMDMiLCJleHAiOjE3NTI4MjIxNTUuMCwiY3JlYXRlX2Zyb20iOiJzZXQiLCJyZHNfZmxhZyI6MSwiZGF0YSI6bnVsbH0.JWZTe5LyiwWXaz_o2j_JfjPDt-CtnBtxW1wjBvd81Q4',
    'Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d': '1752821188',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    # 'Cookie': 'teld_locale=zh-CN; UM_distinctid=19813a8156e18b8-08ad5a8496c4be-17525637-1fa400-19813a8156f3d81; Hm_lvt_d5ff799e852de6d2fedc2aa33390dd6d=1752676439; HMACCOUNT=6D83D73E37231F0E; __jsluid_s=9b9a89bbce6957611303b25b099801bc; ASP.NET_SessionId=mdt3gsdakxsdz5xecc2qq3n1; teldb=efGz7Oo7egLW4JK4LJnksnxjcPDnbslBZJn8yFAOp5A.eyJjbGllbnRfaWQiOm51bGwsInNlc3Npb25faWQiOm51bGwsInRva2VuX2lkIjoiYjM0MTczZDgzNmU4NDUxMGI0YTdmYzkwMDI1YWY1YzQiLCJzb3VyY2UiOiJBIiwiY2xpZW50X2lwIjoiMjcuMjAuMTExLjIwMyIsImV4cCI6MTc4NDM0NzY4MC4wLCJjcmVhdGVfZnJvbSI6InNldCIsInJkc19mbGFnIjoxLCJkYXRhIjpudWxsfQ.A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9; teldc=1; teldz=27.20.111.203; teldk=A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiIiLCJzZXNzaW9uX2lkIjoiIiwidG9rZW5faWQiOiI5MTllZGNkMDQzMzk0ZDdmOWFlYjhlNjMyYTA1MDc2NSIsInJlZnJlc2h0b2tlbl9pZCI6ImIzNDE3M2Q4MzZlODQ1MTBiNGE3ZmM5MDAyNWFmNWM0IiwidmFsaWRhdGVfdHlwZSI6MSwic2NvcGUiOiIqIiwic291cmNlIjoiQSIsImNsaWVudF9pcCI6IjI3LjIwLjExMS4yMDMiLCJleHAiOjE3NTI4MjIxNTUuMCwiY3JlYXRlX2Zyb20iOiJzZXQiLCJyZHNfZmxhZyI6MSwiZGF0YSI6bnVsbH0.JWZTe5LyiwWXaz_o2j_JfjPDt-CtnBtxW1wjBvd81Q4; Hm_lpvt_d5ff799e852de6d2fedc2aa33390dd6d=1752821188',
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

params = {
    'SID': 'CSM-GetStationDivision',
}

data = {
    'helpTag': '',
    'X-Token': 'A01eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiIiLCJzZXNzaW9uX2lkIjoiIiwidG9rZW5faWQiOiI5MTllZGNkMDQzMzk0ZDdmOWFlYjhlNjMyYTA1MDc2NSIsInJlZnJlc2h0b2tlbl9pZCI6ImIzNDE3M2Q4MzZlODQ1MTBiNGE3ZmM5MDAyNWFmNWM0IiwidmFsaWRhdGVfdHlwZSI6MSwic2NvcGUiOiIqIiwic291cmNlIjoiQSIsImNsaWVudF9pcCI6IjI3LjIwLjExMS4yMDMiLCJleHAiOjE3NTI4MjIxNTUuMCwiY3JlYXRlX2Zyb20iOiJzZXQiLCJyZHNfZmxhZyI6MSwiZGF0YSI6bnVsbH0.JWZTe5LyiwWXaz_o2j_JfjPDt-CtnBtxW1wjBvd81Q4',
    'WTS': '1752821186',
    'WVER': '41453a19dc68681959686e6203c4b08195e58468dd0a7126502734b42df99d16c599119ca4e0b7c46bb0a4a3a1094bdc1c9a6299b3a5561f74e97662c825235e4e5bdce42967a41cd19ec1654fbc4ff61fc6616651586fac7c5bb0e8b20e4aeac8361c0054cd46a40f4a65cbc0540ac496ff8e316596398b7806d370936bb279',
    'WSDI': '27.20.111.203',
    'WRS': 'WEB',
    'WCOI': '',
    'WCOL': '',
    'ClientTime': '2025-07-18 14:46:28',
    'DiffentTime': '-2',
    'ClientIdentification': '',
    'sendTime': '2025-07-18 14:46:29',
}

response = requests.post('https://sgi.teld.cn/api/invoke', params=params, cookies=cookies, headers=headers, data=data)
print(response.text)