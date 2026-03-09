import re

import requests
from bs4 import BeautifulSoup



headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    # 'cookie': 'aQQ_ajkguid=4E123C75-1E49-4BF0-A64D-7FB825DE5799; sessid=856FAE54-1209-4886-9F79-70154167C5E6; ajk-appVersion=; seo_source_type=1; fzq_h=8de879b6020495b7855bc850e816e040_1766837859611_86a819cd6860472da1915d84690cddc7_454741455; twe=2; id58=CrIhAmlPzmSfi5gdD42yAg==; xxzlclientid=ef9d8227-a819-40f7-82ec-1766837860833; xxzlxxid=pfmxAd5pZDj7NsYYo7ApFWE0cfvcZ/pfiX0ShV9+UwaHp0M6FfhEi+pq3qFEpXgloPwt; isp=true; 58tj_uuid=c43c6563-8b45-4b1f-97ac-cd7a538d00a3; new_uv=1; als=0; ctid=22; fzq_js_anjuke_ershoufang_pc=22002ce5c74232a28b6897ee8955ee2e_1766840649330_24; obtain_by=1; xxzlbbid=pfmbRDZvXLTaaHixkK898Nfwl1o85JmZmQpCJSlyp+KboXLIYFrU2w+HylGF2VDF0IDFz+RT+fQ10wvnCwH9X5MQ/9fC89DyxI5c+443eSD9phM/vdcWvPnRcV2UVTaKM3+jzQ+WUfwxNzY2ODQwNjUwNTMwODk1_1',
    'pragma': 'no-cache',
    'priority': 'u=0, i',
    'referer': 'https://wuhan.anjuke.com/sale/p2/?from=esf_list',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
}

params = {
    'from': 'esf_list',
}

for page in range(1, 11):
    response = requests.get(f'https://km.fang.anjuke.com/loupan/all/p{page}/', params=params, headers=headers)
    # print(response.text)

    f = open('index.html', 'w',encoding = 'utf-8')
    f.write(response.text)
    # 初始化BeautifulSoup
    soup = BeautifulSoup(response.text, 'lxml')
    # 初始化房源数据列表
    house_data_list = []

    # 解析HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    lists = soup.select('.item-mod')

    if len(lists) == 0:
        print("未找到房源数据")
    else:
        for house in lists:
            # 初始化单条房源数据字典
            house_info = {}

            # 1. 提取楼盘名称（标题）
            title_elem = house.select_one('.items-name')
            house_info['title'] = title_elem.get_text(strip=True) if title_elem else ''

            # 2. 提取房源链接
            link_elem = house.select_one('.pic') or house.select_one('.lp-name')
            house_info['link'] = link_elem['href'] if (link_elem and 'href' in link_elem.attrs) else ''

            # 3. 提取户型类型 + 面积
            huxing_elem = house.select_one('.huxing')
            house_info['huxing_elem'] = huxing_elem.get_text(strip=True) if huxing_elem else ''
            price = house.select_one('.price')
            house_info['price'] = price.get_text(strip=True) if price else ''
            print(house_info)


