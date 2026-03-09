import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding='utf8')
import execjs
import requests
from lxml import etree




session = requests.session()
url = 'https://qikan.cqvip.com/Qikan/Search/Index?from=Qikan_Journal_JournalGuid'
headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://qikan.cqvip.com',
    'pragma': 'no-cache',
    'priority': 'u=0, i',
    'referer': 'https://qikan.cqvip.com/Qikan/Search/Index?from=Qikan_Journal_JournalGuid',
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
def first_request():
    response = session.get(url, headers=headers)
    ojb_html = etree.HTML(response.text)
    contnt_data = ojb_html.xpath('//meta[2]/@content')[0]
    func_code = ojb_html.xpath('//script[1]/text()')[0]
    print(contnt_data,func_code)
    tow_request(contnt_data, func_code)



def tow_request(contnt_data, func_code):
    with open('demo.js',encoding='utf-8') as f:
        js_code = f.read().replace('!"sz_fun"',func_code)
    open('test.js','w',encoding='utf-8').write(js_code)
    js = execjs.compile(js_code)
    cookie = js.call('RS_6')
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