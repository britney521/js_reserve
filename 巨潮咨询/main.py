import requests

cookies = {
    'SF_cookie_4': '90357558',
    'insert_cookie': '37836164',
    'routeId': '.uc2',
    '_sp_ses.2141': '*',
    '_sp_id.2141': 'adb6083d-2178-47b1-912e-795f3b1a80b1.1760080564.1.1760081471.1760080564.13aa5514-4259-4522-91ee-bc689476a5be',
}

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    # 'Content-Length': '0',
    # 'Cookie': 'SF_cookie_4=90357558; insert_cookie=37836164; routeId=.uc2; _sp_ses.2141=*; _sp_id.2141=adb6083d-2178-47b1-912e-795f3b1a80b1.1760080564.1.1760081471.1760080564.13aa5514-4259-4522-91ee-bc689476a5be',
    'Origin': 'https://www.cninfo.com.cn',
    'Referer': 'https://www.cninfo.com.cn/new/commonUrl?url=data/dzjy',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}

response = requests.post('https://www.cninfo.com.cn/data20/ints/statistics', cookies=cookies, headers=headers)
print(response.text)