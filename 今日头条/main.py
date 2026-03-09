from urllib.parse import urlencode

import execjs
import requests
from bs4 import BeautifulSoup

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
    'tt_scid': 'IEqMR1tpmXCFJ7EyQvcXLDk3LyaieHrX4II6F.9gub7fSbKNtvCDJL4NCdVU9p3s792c',
    'ttwid': '1%7Cn8lcgFUirhKCkE6TEt3FByJg38-hhVzyGGwBFoth70w%7C1722069569%7Cc192587e9f3c7f94e9680491f3ab4bebc6a6735f90a87ef24aececa8a11fa1f2',
    '_ga_QEHZPBE5HH': 'GS1.1.1722067181.6.1.1722069650.0.0.0',
}
headers = {
    'referer': 'https://www.toutiao.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
}

def scwal(i):
    global max_behot_time
    params = {
        'channel_id': '3189398999',  # 94349549395 国际
        'max_behot_time': max_behot_time,
        'offset': '0',
        'refresh_count': '2',
        'category': 'pc_profile_channel',
        'client_extra_params': '{"short_video_item":"filter"}',
        'aid': '24',
        'app_name': 'toutiao_web',
        'msToken': '9vejotIacX7dus7mn3c9cstXULcIUSRi4rORbBaJ28lu38aMiRzavxk0W2bgdbYDl8aqZIcx_j0aUvQXdmpZR-20uTkDoKAr4fUYTPlql552ZCRZ8ueh',
        # 'a_bogus': 'D6RZQQufdkIsXfyV51ALfY3qV6-3Y8zZ0t9bMDhq-VVTtg39HMOq9exE42tvMdRjNs/DIeYjy4hbTpQBrQcrM1wf9W0L/2A2mESkKl5Q5xSSs1X9eghgJUhimkt5SMx2RkBlrOXsoh3HFRbpWnAJ5kIlO62-zo0/94D=',
    }

    params_str = urlencode(params)
    arg = [
        0,
        1,
        8,
        params_str,
        "",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
    ]
    node = execjs.get()
    ctx = node.compile(open('js/ab.js', 'r', encoding='utf-8', errors='ignore').read())
    a_bogus = ctx.call('get_a_bogus', arg)
    print('a_bogus', a_bogus)
    params['a_bogus'] = a_bogus
    print('max_behot_time', params['max_behot_time'])
    print(f'下载第{i + 1}页数据,max_behot_time::', params['max_behot_time'], '---------------------------')
    response = requests.get('https://www.toutiao.com/api/pc/list/feed', params=params, headers=headers)
    # print('response::',response.json())
    data = response.json()['data']
    max_behot_time = data[0]['behot_time']

    # headers.pop('min_behot_time')
    params['max_behot_time'] = max_behot_time

    for i in data:
        Abstract = i.get('Abstract')
        id = i.get('id')
        title = i.get('title')
        group_id = i.get('group_id')
        article_url = i.get('article_url')
        behot_time = i.get('behot_time')
        comment_count = i.get('comment_count')
        digg_count = i.get('digg_count')
        display_url = i.get('display_url')
        # 媒体信息
        media_name = i.get('media_name')
        print(title, behot_time)

def scwal_detail():
    response = requests.get('https://www.toutiao.com/article/7395081467930133027/', cookies=cookies, headers=headers)
    print(response.text)
    f = open('result.html', 'w', encoding='utf8')
    f.write(response.text)
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.select_one('.article-content h1').text.strip()
    author = soup.select_one('.article-content .name a').text.strip()
    content = soup.select_one('article').get_text(strip=True)

    print(title,author,content)

if __name__ == '__main__':
    max_behot_time = '0'
    for i in range(1):  # ��取3次数据
        scwal(i)
    # scwal_detail()