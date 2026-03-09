import requests
import re

headers = {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'origin': 'https://www.yfsp.tv',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.yfsp.tv/',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
}

params = {
    'id': 'Fq0i1fbkySD8fXMjy6P09D',
}

response = requests.get('https://upload.yfsp.tv/api/video/MasterPlayList', params=params, headers=headers)
print(response.text)
url_pattern = re.compile(r'https?:\/\/[^\s]+')

# 使用 findall 方法查找所有匹配的 URL
url = url_pattern.findall(response.text)[0]
response = requests.get(url, params=params, headers=headers)
# print(response.text)

urls = url_pattern.findall(response.text)

# 打印所有找到的 URL
with open(f'video/vbaa.mp4','wb') as f:
    for url in urls:
        print(url)
        response = requests.get(url)
        f.write(response.content)
