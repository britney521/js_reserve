import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding='utf8')
import execjs
import requests
from lxml import etree




session = requests.session()
url = 'https://sugh.szu.edu.cn/Html/News/Columns/568/Index.html'
headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://ec.chng.com.cn/channel/home/?SlJfApAfmEBp=1749025484490",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
def first_request():
    response = session.get(url, headers=headers)
    ojb_html = etree.HTML(response.text)
    contnt_data = ojb_html.xpath('//meta[2]/@content')[0]
    func_code = ojb_html.xpath('//script[1]/text()')[0]
    tow_request(contnt_data, func_code)



def tow_request(contnt_data, func_code):
    with open('demo.js',encoding='utf-8') as f:
        js_code = f.read().replace('!"sz_fun"',func_code)
    open('test.js','w',encoding='utf-8').write(js_code)
    js = execjs.compile(js_code)
    cookie = js.call('RS_5')
    cookies = {
        cookie['name']: cookie['value']
    }
    # # print(cookies)
    res = session.get(url, headers=headers, cookies=cookies)
    print(res.status_code)
    res.encoding = 'utf-8'
    print(res.text)


def main():
    first_request()

if __name__ == '__main__':
    main()