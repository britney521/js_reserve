import requests
from bs4 import BeautifulSoup

cookies = {
    'HWWAFSESID': '6198ff191e8bb13616',
    'HWWAFSESTIME': '1764812238330',
    'csrfToken': 'GreFSOUiuyq9Ahlg_odJsVy4',
    'CUID': 'f34869cc16062f6658042a2d8a9e5cd1',
    'jsid': 'SEO-BAIDU-ALL-SY-000001',
    'TYCID': 'c6d65750d0b111f0b05bc1b1ef9304d2',
    'sajssdk_2015_cross_new_user': '1',
    'bdHomeCount': '0',
    'Hm_lvt_e92c8d65d92d534b0fc290df538b4758': '1764812242',
    'HMACCOUNT': '834A0EEFB71A8422',
    'bannerFlag': 'true',
    'sensorsdata2015jssdkcross': '%7B%22distinct_id%22%3A%22308462737%22%2C%22first_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlhZTcwMWJjNDYyZjQ2LTAzOTU1MGQ2YTFmNTJmMi0xNzUyNTYzNy0yMDczNjAwLTE5YWU3MDFiYzQ3MWUyZSIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjMwODQ2MjczNyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22308462737%22%7D%2C%22%24device_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%7D',
    'tyc-user-info': '%7B%22state%22%3A%220%22%2C%22vipManager%22%3A%220%22%2C%22mobile%22%3A%2217315231596%22%2C%22userId%22%3A%22308462737%22%7D',
    'tyc-user-info-save-time': '1764825317594',
    'auth_token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc2NDgyNTMxNywiZXhwIjoxNzY3NDE3MzE3fQ.sbBqBQJM2PCQkZeVDiSCQ65-XhxkIxPJ292qIyo9Txv-4Y11rmvBfS4-56Mu48xGiRdYK-CqF_4kJmOOLQ-kAA',
    'searchSessionId': '1764827475.63417789',
    'Hm_lpvt_e92c8d65d92d534b0fc290df538b4758': '1764827476',
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    # 'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Referer': 'https://www.tianyancha.com/nsearch?key=%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%98%89%E4%BF%A1%E8%BE%BE%E4%B8%89%E5%8F%B7%E6%8A%95%E8%B5%84%E5%90%88%E4%BC%99%E4%BC%81%E4%B8%9A%EF%BC%88%E6%9C%89%E9%99%90%E5%90%88%E4%BC%99%EF%BC%89',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    # 'Cookie': 'HWWAFSESID=6198ff191e8bb13616; HWWAFSESTIME=1764812238330; csrfToken=GreFSOUiuyq9Ahlg_odJsVy4; CUID=f34869cc16062f6658042a2d8a9e5cd1; jsid=SEO-BAIDU-ALL-SY-000001; TYCID=c6d65750d0b111f0b05bc1b1ef9304d2; sajssdk_2015_cross_new_user=1; bdHomeCount=0; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1764812242; HMACCOUNT=834A0EEFB71A8422; bannerFlag=true; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22308462737%22%2C%22first_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlhZTcwMWJjNDYyZjQ2LTAzOTU1MGQ2YTFmNTJmMi0xNzUyNTYzNy0yMDczNjAwLTE5YWU3MDFiYzQ3MWUyZSIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjMwODQ2MjczNyJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22308462737%22%7D%2C%22%24device_id%22%3A%2219ae701bc462f46-039550d6a1f52f2-17525637-2073600-19ae701bc471e2e%22%7D; tyc-user-info=%7B%22state%22%3A%220%22%2C%22vipManager%22%3A%220%22%2C%22mobile%22%3A%2217315231596%22%2C%22userId%22%3A%22308462737%22%7D; tyc-user-info-save-time=1764825317594; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNzMxNTIzMTU5NiIsImlhdCI6MTc2NDgyNTMxNywiZXhwIjoxNzY3NDE3MzE3fQ.sbBqBQJM2PCQkZeVDiSCQ65-XhxkIxPJ292qIyo9Txv-4Y11rmvBfS4-56Mu48xGiRdYK-CqF_4kJmOOLQ-kAA; searchSessionId=1764827475.63417789; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1764827476',
}

params = {
    'key': '深圳市嘉信达三号投资合伙企业（有限合伙）',
}

response = requests.get('https://www.tianyancha.com/nsearch', params=params, cookies=cookies, headers=headers)

print(response.text)
soup = BeautifulSoup(response.text, 'lxml')
company = soup.select_one('.index_alink__zcia5').get_text()
legal = soup.select_one('.index_info-col__UVcZb .link-click').get_text()
print(company,legal)
