import subprocess
import time
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding='utf8')
import execjs
import requests
from lxml import etree




session = requests.session()
def first_request():
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Referer": "https://www.nmpa.gov.cn/datasearch/home-index.html",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }
    url = "https://www.nmpa.gov.cn/datasearch/search-result.html"

    response = session.get(url, headers=headers)
    print(response.text)
    ojb_html = etree.HTML(response.text)
    contnt_data = ojb_html.xpath('//meta[2]/@content')[0]
    func_code = ojb_html.xpath('//script[1]/text()')[0]
    # print(contnt_data, func_code)
    tow_request(contnt_data, func_code)

def tow_request(contnt_data, func_code):
    for i in range(1,999999999):
        with open('demo.js',encoding='utf-8') as f:
            js_code = f.read().replace('!"sz_fun"',func_code)
        open('test.js','w',encoding='utf-8').write(js_code)
        js = execjs.compile(js_code)
        cookie = js.call('RS_6')
        cookies = {
            cookie['name']: cookie['value']
        }
        current_timestamp = str(int(round(time.time() * 1000)))
        params = {
            "itemId": "ff808081830b103501838d4871b53543",
            "isSenior": "N",
            "searchValue": "口红",
            "pageNum": str(i),
            "pageSize": "10",
            "timestamp": current_timestamp
        }
        with open('search.js',encoding='utf-8') as f:
            js_code2 = f.read()
        ctx = execjs.compile(js_code2)
        encoded_params = f'isSenior=N&itemId=ff808081830b103501838d4871b53543&pageNum={i}&pageSize=10&searchValue=注&timestamp={current_timestamp}'
        sign = ctx.call('get_sign', encoded_params)

        headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://www.nmpa.gov.cn/datasearch/search-result.html",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sign": sign,
            "timestamp": current_timestamp,
            "token": "false"
        }

        url = "https://www.nmpa.gov.cn/datasearch/data/nmpadata/search"

        response = session.get(url, headers=headers,  params=params,cookies=cookies)

        print(response.text)



if __name__ == '__main__':
    first_request()