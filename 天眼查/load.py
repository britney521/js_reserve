import requests

cookies = {
    'captcha_v4_user': '89af6f043a6849e0bf6e187cc939d856',
}

headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    # 'Cookie': 'captcha_v4_user=89af6f043a6849e0bf6e187cc939d856',
    'Pragma': 'no-cache',
    'Referer': 'https://www.tianyancha.com/',
    'Sec-Fetch-Dest': 'script',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

params = {
    'callback': 'geetest_1723540861261',
    'captcha_id': '517df78b31ff1b8f841cd86fc0db9f3e',
    'challenge': '48bc64ae-c260-4547-8943-52046eb5617c',
    'client_type': 'web',
    'lang': 'zho',
}

response = requests.get('https://gcaptcha4.geetest.com/load', params=params, cookies=cookies, headers=headers)
print(response.json())