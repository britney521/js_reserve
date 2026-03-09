import json
import re
import requests

from 一帆视频.get_url import get_resurl
from 一帆视频.jiami import get_sign

headers = {
    'referer': 'https://www.yfsp.tv/play/OgInIzHeOsF',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
}
res = requests.get('https://www.yfsp.tv/play/Cwy9wuxg4ZF',headers=headers)
#
# print(res.text)
match = re.search(r'var injectJson = (\{.*?\});', res.text, re.DOTALL)
if match:
    inject_json_str = match.group(1)  # 获取匹配的JSON字符串
    inject_json = json.loads(inject_json_str)  # 将JSON字符串转换为Python字典
    publicKey = inject_json['config'][0]['pConfig']['publicKey']
    privateKey = inject_json['config'][0]['pConfig']['privateKey']
    print('key',publicKey,privateKey)

    vv = get_sign(publicKey,privateKey)

    addrurl = get_resurl(publicKey, privateKey)
    print('addrurl',addrurl)
else:
    print("No match found")
params = {
    'vv': vv,
    'pub': publicKey,
}

response = requests.get(addrurl, params=params, headers=headers)
print(response.text)

url_pattern = re.compile(r'https?:\/\/[^\s]+')
ts_pattern = re.compile(r'#EXTINF:.*?,\s*(.*\.ts\?.*)')

# 使用 findall 方法查找所有匹配的 URL
urls = url_pattern.findall(response.text)

base_ts = 'https://s8-e1.pipecdn.vip/ppot/_definst_/mp4:s16/jvod/jq-nxrs-720p-01BDDEDCC-hd.mp4/'
with open(f'video/vbaa.mp4','wb') as f:
    for url in urls:
        response = requests.get(url,headers=headers)
        # print(response.text)
        tss = ts_pattern.findall(response.text)
        for ts in tss:
            print(ts)
            response = requests.get(base_ts+ts, headers=headers)
            f.write(response.content)
# response = requests.get('https://s8-e1.dnvodcdn.me/ppot/_definst_/mp4:s8/ivod/dy-msts-480p-03B43A25F.mp4/chunklist.m3u8?vendtime=1726466009&vhash=geJaXaykwHBGUpo0_bskacvTImS_PeX6WciRFrjvUKU=&vCustomParameter=0_140.82.22.64.US_1&lb=21a6bd31bc3ef96c28f05668a3953615&us=1&vv=e2c49bbcc1054a200cc9a596efbfa36a&pub=CJSoDZ8uEJKsDoupCJbVLLDVCJGmBZWoBZ8oBZOqNsGnPZ1XP3PYDcGvPZHZCJbYDcLcDJ4vPc4tOpOnE3TaNsOqP6PbOpLZOZOuDpatOpKvCJ1bCs9cOM5XCMPZPJ0t', headers=headers)
# print(response.text)
# url_pattern = re.compile(r'media_[\d]+\.ts\S*')
#
#
# urls = url_pattern.findall(response.text)
# print(urls)
# baseurl = 'https://s8-e1.dnvodcdn.me/ppot/_definst_/mp4:s8/ivod/dy-msts-480p-03B43A25F.mp4/'
# # 打印所有找到的 URL
# with open(f'video/movie.mp4','wb') as f:
#     for url in urls:
#         print(baseurl + url)
#         name = url.split('_')[0]
#         response = requests.get(baseurl + url,headers=headers)
#         f.write(response.content)
#
