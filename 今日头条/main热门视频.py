from urllib.parse import urlencode

import execjs
import requests

cookies = {
    '__ac_signature': '_02B4Z6wo00f01cD6GTgAAIDAH6HqdSn0Ym3A2h2AABaq01',
    'tt_webid': '7392142234839483923',
    'ttcid': '9b038e530c65454797b72f201142ab8622',
    'x-web-secsdk-uid': '54722416-e890-4095-8219-5822c3d6fcd6',
    'local_city_cache': '%E9%9A%8F%E5%B7%9E',
    '_ga': 'GA1.1.706803583.1721117256',
    'csrftoken': '1963ae85d68d027785b270202db9734a',
    's_v_web_id': 'verify_lyo4rz07_30rM3xOC_DKGr_4sy8_B2OE_dVUIEHcT7ZgN',
    'gfkadpd': '24,6457',
    'msToken': '0-TZDnAYE_BKymOgTE6AYtZlvTSLubzjBaUf4UfDXoMf4gYdCMpuBegWwSaQrOEDABHYac0MQYZIT-2746KwC3vwwFEkaohS5AUQmRZHLQ7orrMWtyU8',
    'tt_scid': 'ER0rR1JI7q3w6xkzVyy5vPGM6GFEWeACA7OAboucw2bRFhLqDZdHYicHjDYKGvsudc8b',
    'ttwid': '1%7Cn8lcgFUirhKCkE6TEt3FByJg38-hhVzyGGwBFoth70w%7C1722215930%7C0e2f6e88bb55b2a1d065f78f701cf0d6a534af82738f33d8f63c211000909b6a',
    '_ga_QEHZPBE5HH': 'GS1.1.1722215877.10.1.1722215944.0.0.0',
}

headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    # Requests sorts cookies= alphabetically
    # 'cookie': '__ac_signature=_02B4Z6wo00f01cD6GTgAAIDAH6HqdSn0Ym3A2h2AABaq01; tt_webid=7392142234839483923; ttcid=9b038e530c65454797b72f201142ab8622; x-web-secsdk-uid=54722416-e890-4095-8219-5822c3d6fcd6; local_city_cache=%E9%9A%8F%E5%B7%9E; _ga=GA1.1.706803583.1721117256; csrftoken=1963ae85d68d027785b270202db9734a; s_v_web_id=verify_lyo4rz07_30rM3xOC_DKGr_4sy8_B2OE_dVUIEHcT7ZgN; gfkadpd=24,6457; msToken=0-TZDnAYE_BKymOgTE6AYtZlvTSLubzjBaUf4UfDXoMf4gYdCMpuBegWwSaQrOEDABHYac0MQYZIT-2746KwC3vwwFEkaohS5AUQmRZHLQ7orrMWtyU8; tt_scid=ER0rR1JI7q3w6xkzVyy5vPGM6GFEWeACA7OAboucw2bRFhLqDZdHYicHjDYKGvsudc8b; ttwid=1%7Cn8lcgFUirhKCkE6TEt3FByJg38-hhVzyGGwBFoth70w%7C1722215930%7C0e2f6e88bb55b2a1d065f78f701cf0d6a534af82738f33d8f63c211000909b6a; _ga_QEHZPBE5HH=GS1.1.1722215877.10.1.1722215944.0.0.0',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.toutiao.com/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}

params = {
    'offset': '0',
    'channel_id': '94349549395',
    'max_behot_time': '0',
    'category': 'pc_profile_channel',
    'disable_raw_data': 'true',
    'aid': '24',
    'app_name': 'toutiao_web',
    'msToken': '_hH3lhECcaejyRgD9EG0QUQiUPNo6kyIKnPsSW3pNmicYO3z0IDQxYem_l0oS6xBa0eQilsJZZ87PqBdfPPce4pnb0oQAtuIzRnlIVkZCXR86DLqPIxz6A==',
    # 'a_bogus': 'EvRMBD8vDkgpXDS151xLfY3qVva3Ymtx0t9bMDhqLVfVs639HMOn9exo5yTva38jNs/DIeYjy4hbTpQBrQcrM1wf9W0L/2A2mESkKl5Q5xSSs1X9eghgJUhimkt5SMx2RkBlrOXsoh3HFmjklxAJ5kIlO62-zo0/9Wy=',
}
params_str = urlencode(params)
arg = [
    0,
    1,
    12,
    params_str,
    "",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
]
node = execjs.get()
ctx = node.compile(open('js/ab.js', 'r', encoding='utf-8', errors='ignore').read())
a_bogus = ctx.call('get_a_bogus', arg)
print('a_bogus', a_bogus)
params['a_bogus'] = a_bogus
response = requests.get('https://www.toutiao.com/api/pc/list/feed', params=params, cookies=cookies, headers=headers)
datas = response.json()['data']
for data in datas:
    id = data['id']
    title = data['title']
    article_url = data.get('article_url')
    comment_count = data['comment_count']
    print(id,title,article_url)