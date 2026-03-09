import requests
import execjs

headers = {
    'accept': 'application/json',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'cache-ts': '1745990666289',
    'encryption': 'true',
    'language': 'zh',
    'origin': 'https://www.coinglass.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.coinglass.com/',
    'sec-ch-ua': '"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
}

params = {
    'sort': '',
    'order': '',
    'keyword': '',
    'pageNum': '2',
    'pageSize': '20',
    'ex': 'all',
}

response = requests.get('https://capi.coinglass.com/api/home/v2/coinMarkets', params=params, headers=headers)
print(response.headers)
ctx = execjs.compile(open('js.js','r',encoding='utf-8').read())
data = ctx.call('get_data',response.headers['user'],response.json()['data'])
print(data)
